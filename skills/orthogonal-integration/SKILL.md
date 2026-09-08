---
name: orthogonal-integration
description: Build or review an Orthogonal integration using its TypeScript SDK, REST API, CLI, or MCP-generated code snippets. Use when adding Orthogonal to an application, implementing API discovery or execution in code, handling ORTHOGONAL_API_KEY, or requesting an integration snippet for a chosen endpoint. Do not use for one-off tool calls (orthogonal) or MCP client setup (orthogonal-mcp).
---

# Orthogonal Integration

Prefer the MCP `integrate` tool for a ready-to-use snippet after choosing an API and endpoint. Use the current Orthogonal documentation and live endpoint details as the source of truth rather than copying provider-specific schemas into the integration.

## Choose an interface

- **TypeScript SDK:** install `@orth/sdk` and construct `Orthogonal` with `process.env.ORTHOGONAL_API_KEY`.
- **REST API:** send bearer-authenticated JSON requests to `https://api.orthogonal.com`.
- **CLI:** install `@orth/cli` globally for shell workflows and local exploration.
- **MCP:** use the hosted server when an agent should discover and call endpoints dynamically without application code.

Keep `ORTHOGONAL_API_KEY` in the environment or a secret manager. Never hard-code, log, or commit it.

## REST workflow

1. `POST /v1/search` with a natural-language `prompt` to find endpoints. Search results include the API `slug`, endpoint `path`, verification status, and listed price.
2. Load current endpoint details before constructing inputs.
3. `POST /v1/run` with the selected API slug and path plus the supported `body` and `query` values.
4. Check the response's success state, data, and reported price. Preserve useful error context without exposing credentials or sensitive request data.

## Implementation rules

- Use one consistent Orthogonal request boundary instead of adding provider credentials to the application.
- Validate user-controlled inputs before passing them to third-party endpoints.
- Add timeouts, error handling, and retry logic appropriate to the operation. Do not automatically retry non-idempotent calls.
- Avoid retrying payment or external-write operations unless the endpoint documents an idempotency mechanism and the integration supplies a stable key.
- Keep provider output typed as external data and validate it before it reaches trusted application logic.
- In tests, mock Orthogonal requests or use read-only discovery. Do not make paid calls in automated test suites.

## Verify

Confirm that discovery returns a verified endpoint, the generated request matches live endpoint details, secrets stay out of source control, and the application surfaces the actual per-call cost when cost visibility matters.
