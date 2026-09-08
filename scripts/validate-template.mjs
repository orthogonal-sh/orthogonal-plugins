#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const errors = [];

async function readJson(relativePath) {
  try {
    return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
  } catch (error) {
    errors.push(`${relativePath}: ${error.message}`);
    return null;
  }
}

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath));
    return true;
  } catch {
    return false;
  }
}

if (await exists(".cursor-plugin/marketplace.json")) {
  errors.push("Single-plugin repositories must not include marketplace.json.");
}

const manifest = await readJson(".cursor-plugin/plugin.json");

if (manifest) {
  if (!/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(manifest.name ?? "")) {
    errors.push("Plugin name must be lowercase and use alphanumerics, hyphens, or periods.");
  }
  if (manifest.name !== "orthogonal") errors.push("Plugin name must be orthogonal.");
  if (manifest.author?.name !== "ChristianPickettCode") {
    errors.push("Plugin author must be ChristianPickettCode.");
  }

  for (const field of ["version", "description", "homepage", "repository", "license", "logo", "mcpServers"]) {
    if (!manifest[field]) errors.push(`Plugin manifest field is required: ${field}.`);
  }

  if (manifest.homepage !== "https://www.orthogonal.com") {
    errors.push("Plugin homepage is incorrect.");
  }
  if (manifest.repository !== "https://github.com/orthogonal-sh/orthogonal-plugins") {
    errors.push("Plugin repository URL is incorrect.");
  }

  for (const referencedFile of [manifest.logo, manifest.mcpServers]) {
    if (!referencedFile || !(await exists(referencedFile))) {
      errors.push(`Referenced file is missing: ${referencedFile}.`);
    }
  }
}

const mcp = await readJson(manifest?.mcpServers ?? "mcp.json");
const servers = mcp?.mcpServers;

if (!servers || Object.keys(servers).length !== 1) {
  errors.push("mcp.json must define exactly one MCP server.");
}
if (servers?.orthogonal?.url !== "https://mcp.orthogonal.com") {
  errors.push("Orthogonal MCP URL is missing or incorrect.");
}

for (const requiredFile of ["README.md", "LICENSE"]) {
  if (!(await exists(requiredFile))) errors.push(`Required file is missing: ${requiredFile}.`);
}

if (errors.length) {
  console.error("Validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Validation passed.");
