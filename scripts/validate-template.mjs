#!/usr/bin/env node

import { createHash } from "node:crypto";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const errors = [];
const expectedAuthor = "ChristianPickettCode";
const expectedHomepage = "https://www.orthogonal.com";
const expectedRepository = "https://github.com/orthogonal-sh/orthogonal-plugins";
const expectedMcpUrl = "https://mcp.orthogonal.com";
const expectedLogoSha256 = "97f96e9e4f78a3d6e92a07f7e5f630e8af6845d6f8f6b1ad85c87daad70137f2";

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readJson(relativePath) {
  try {
    return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: invalid or unreadable JSON: ${error.message}`);
    return {};
  }
}

async function checkRelativePath(owner, value) {
  if (typeof value !== "string" || !value.startsWith("./")) {
    errors.push(`${owner}: expected a ./-prefixed relative path, got ${JSON.stringify(value)}`);
    return;
  }

  const target = path.resolve(root, value.slice(2));
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    errors.push(`${owner}: path escapes the plugin root`);
    return;
  }
  if (!(await exists(value.slice(2)))) {
    errors.push(`${owner}: referenced path does not exist: ${value}`);
  }
}

const manifestPaths = {
  claude: ".claude-plugin/plugin.json",
  codex: ".codex-plugin/plugin.json",
  cursor: ".cursor-plugin/plugin.json",
  open: ".plugin/plugin.json",
};

const manifests = {};
for (const [surface, relativePath] of Object.entries(manifestPaths)) {
  manifests[surface] = await readJson(relativePath);
}

const versions = new Set(Object.values(manifests).map((manifest) => manifest.version));
if (versions.size !== 1 || versions.has(undefined)) {
  errors.push(`plugin manifest versions are not synchronized: ${JSON.stringify(Object.fromEntries(Object.entries(manifests).map(([name, manifest]) => [name, manifest.version])))}`);
}

for (const [surface, manifest] of Object.entries(manifests)) {
  if (manifest.name !== "orthogonal") errors.push(`${surface}: plugin name must be orthogonal`);
  if (manifest.author?.name !== expectedAuthor) errors.push(`${surface}: author must be ${expectedAuthor}`);
  if (manifest.homepage !== expectedHomepage) errors.push(`${surface}: homepage is incorrect`);
  if (manifest.repository !== expectedRepository) errors.push(`${surface}: repository is incorrect`);
  if (manifest.license !== "MIT") errors.push(`${surface}: license must be MIT`);

  for (const field of ["skills", "mcpServers", "logo"]) {
    if (field in manifest) await checkRelativePath(`${surface}.${field}`, manifest[field]);
  }

  for (const field of ["composerIcon", "logo", "logoDark"]) {
    if (field in (manifest.interface ?? {})) {
      await checkRelativePath(`${surface}.interface.${field}`, manifest.interface[field]);
    }
  }
}

const mcp = await readJson(".mcp.json");
const servers = mcp.mcpServers ?? {};
if (Object.keys(servers).length !== 1) errors.push(".mcp.json must define exactly one MCP server");
if (JSON.stringify(servers.orthogonal) !== JSON.stringify({ type: "http", url: expectedMcpUrl })) {
  errors.push(".mcp.json must contain the hosted OAuth-compatible Orthogonal server");
}
if (await exists("mcp.json")) errors.push("use the shared .mcp.json; stale mcp.json must not exist");

const agentsMarketplace = await readJson(".agents/plugins/marketplace.json");
if (agentsMarketplace.name !== "orthogonal") errors.push(".agents marketplace name must be orthogonal");
const agentsEntry = agentsMarketplace.plugins?.[0];
if (agentsEntry?.name !== "orthogonal" || agentsEntry?.source?.source !== "local" || agentsEntry?.source?.path !== "./") {
  errors.push(".agents marketplace must expose the root Orthogonal plugin");
}

const claudeMarketplace = await readJson(".claude-plugin/marketplace.json");
if (claudeMarketplace.name !== "orthogonal") errors.push("Claude marketplace name must be orthogonal");
if (claudeMarketplace.owner?.name !== expectedAuthor) errors.push(`Claude marketplace owner must be ${expectedAuthor}`);
if (claudeMarketplace.plugins?.[0]?.name !== "orthogonal" || claudeMarketplace.plugins?.[0]?.source !== "./") {
  errors.push("Claude marketplace must expose the root Orthogonal plugin");
}

const readme = await readFile(path.join(root, "README.md"), "utf8");
if (!readme.includes("\n## Installations\n")) errors.push('README.md must contain the exact "Installations" section heading');
for (const client of ["Codex", "Claude Code", "Cursor", "Grok Bot"]) {
  if (!readme.includes(`### ${client}`)) errors.push(`README.md is missing the ${client} installation section`);
}

const skillRoot = path.join(root, "skills");
const skillDirectories = (await readdir(skillRoot, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

for (const skillName of skillDirectories) {
  const skillPath = `skills/${skillName}/SKILL.md`;
  const openaiPath = `skills/${skillName}/agents/openai.yaml`;
  if (!(await exists(skillPath))) {
    errors.push(`${skillName}: missing SKILL.md`);
    continue;
  }
  if (!(await exists(openaiPath))) {
    errors.push(`${skillName}: missing agents/openai.yaml`);
    continue;
  }

  const skill = await readFile(path.join(root, skillPath), "utf8");
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    errors.push(`${skillName}: invalid YAML frontmatter boundary`);
    continue;
  }
  const keys = frontmatter[1]
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(":", 1)[0].trim());
  if (JSON.stringify(keys.sort()) !== JSON.stringify(["description", "name"])) {
    errors.push(`${skillName}: frontmatter must contain only name and description`);
  }
  if (!frontmatter[1].includes(`name: ${skillName}`)) errors.push(`${skillName}: frontmatter name does not match folder`);

  const openai = await readFile(path.join(root, openaiPath), "utf8");
  if (!openai.includes(`$${skillName}`)) errors.push(`${skillName}: default_prompt must mention $${skillName}`);
  if (skillName !== "orthogonal-mcp" && !openai.includes(expectedMcpUrl)) {
    errors.push(`${skillName}: missing hosted MCP dependency`);
  }
}

if (skillDirectories.join(",") !== "orthogonal,orthogonal-integration,orthogonal-mcp") {
  errors.push(`unexpected skill set: ${skillDirectories.join(", ")}`);
}

const logo = await readFile(path.join(root, "assets/logo.jpg"));
const logoSha256 = createHash("sha256").update(logo).digest("hex");
if (logoSha256 !== expectedLogoSha256) errors.push("assets/logo.jpg is not the verified official Orthogonal logo asset");

for (const requiredFile of ["CHANGELOG.md", "LICENSE", "README.md"]) {
  if (!(await exists(requiredFile))) errors.push(`required file is missing: ${requiredFile}`);
}

if (errors.length) {
  console.error("Validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validation passed: ${Object.keys(manifests).length} manifests, ${skillDirectories.length} skills`);
