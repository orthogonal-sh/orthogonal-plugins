#!/usr/bin/env node

import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const errors = [];
const namePattern = /^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/;

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

const marketplace = await readJson(".cursor-plugin/marketplace.json");

if (marketplace) {
  if (!namePattern.test(marketplace.name ?? "")) {
    errors.push("Marketplace name must be lowercase kebab-case.");
  }

  if (!marketplace.owner?.name) {
    errors.push("Marketplace owner.name is required.");
  }

  if (!Array.isArray(marketplace.plugins) || marketplace.plugins.length === 0) {
    errors.push("Marketplace plugins must be a non-empty array.");
  } else {
    for (const entry of marketplace.plugins) {
      if (!namePattern.test(entry.name ?? "")) {
        errors.push(`Invalid plugin name: ${entry.name}`);
        continue;
      }

      const source = String(entry.source ?? "").replace(/^\.\//, "");
      if (!source || source.includes("..") || path.isAbsolute(source)) {
        errors.push(`${entry.name}: source must be a safe relative path.`);
        continue;
      }

      try {
        const sourceStat = await stat(path.join(root, source));
        if (!sourceStat.isDirectory()) {
          errors.push(`${entry.name}: source is not a directory.`);
          continue;
        }
      } catch {
        errors.push(`${entry.name}: source directory is missing.`);
        continue;
      }

      const manifestPath = path.join(source, ".cursor-plugin/plugin.json");
      const manifest = await readJson(manifestPath);
      if (!manifest) continue;

      if (manifest.name !== entry.name) {
        errors.push(`${entry.name}: marketplace and plugin manifest names differ.`);
      }

      for (const field of ["version", "description", "author", "license"]) {
        if (!manifest[field]) errors.push(`${entry.name}: ${field} is required.`);
      }

      for (const relativeAsset of [manifest.logo, manifest.mcpServers]) {
        if (!relativeAsset || !(await exists(path.join(source, relativeAsset)))) {
          errors.push(`${entry.name}: referenced file is missing: ${relativeAsset}`);
        }
      }

      const mcp = await readJson(path.join(source, manifest.mcpServers ?? "mcp.json"));
      const server = mcp?.mcpServers?.orthogonal;
      if (server?.url !== "https://mcp.orthogonal.com") {
        errors.push(`${entry.name}: Orthogonal MCP URL is missing or incorrect.`);
      }
    }
  }
}

if (errors.length) {
  console.error("Validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Validation passed.");
