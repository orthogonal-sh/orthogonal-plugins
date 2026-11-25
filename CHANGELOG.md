# Changelog

## 0.3.5 - 2026-11-25

- `claude/assets/logo.png`: fill the symbol's two quarters with brand cream (#F7F6F1) instead of leaving them transparent. On Claude's dark pages the transparent quarters showed the dark background, so the directory icon read as a near-black square.

## 0.3.4 - 2026-11-24

- Add `claude/`, the Claude plugin directory submission: only the Claude manifest, `.mcp.json`, icon, README and the `orthogonal` and `orthogonal-mcp` skills. The directory refuses scripts and other clients' files in the submitted folder, and the SDK skill reads `ORTHOGONAL_API_KEY`. `scripts/validate-template.mjs` keeps the copies equal to the originals.
- The `orthogonal` marketplace now installs `claude/`, so Claude Code gets the same plugin as the directory.

## 0.3.3 - 2026-11-24

- Claude Code: give the hosted MCP server `"type": "http"` in `.mcp.json`. Without it Claude Code dropped the server at load, so installs got the skills but no MCP server.
- Claude manifest: add the directory icon and documentation, support, privacy and terms links.
- README: say what the plugin sends and fetches, and give example prompts.
- Cursor keeps its url-only server config in `.cursor-mcp.json`, as its plugin docs show.
- CI: run `claude plugin validate . --strict`.

## 0.3.2 - 2026-11-24

- OpenAI OAuth asks for `profile email` only and turns OIDC off: Orthogonal's authorization server does not grant `openid` to dynamically registered clients.

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
