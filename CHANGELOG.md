# Changelog

## 0.3.1 - 2026-11-24

- Drop pricing and credit wording from the OpenAI listing description, per the plugin dashboard's metadata check.

## 0.3.0 - 2026-11-24

- Add the OpenAI plugin directory metadata (ChatGPT and Codex) to the portable manifest: listing, review test cases and release notes.
- Declare OAuth with dynamic client registration for the hosted MCP server in `mcp.json`.
- Add square PNG logo and composer icons, light and dark.
- Publish as the Orthogonal organization and drop unverified endpoint and provider counts.
- Document the five account tools available after sign-in.
- Add `scripts/build-openai-zip.sh`, which packages only the OpenAI submission files.

## 0.2.1 - 2026-09-08

- Adopt the Agent Plugins 1.0 portable manifest and MCP configuration format.
- Use each client family's documented MCP configuration shape.
- Update Cursor installation guidance to match the current Customize interface.
- Remove implementation-reference language from the public README.

## 0.2.0 - 2026-09-08

- Add dedicated skills for the Orthogonal CLI and the official TypeScript and Python SDKs.
- Narrow skill routing so MCP calls, SDK development, CLI workflows, and MCP setup do not overlap.

## 0.1.0 - 2026-09-08

- Add native manifests for Codex, Claude Code, and Cursor.
- Add Codex and Claude marketplace indexes.
- Connect all supported clients to the hosted Orthogonal MCP server.
- Include portable skills for Orthogonal workflows, integrations, and MCP setup.
