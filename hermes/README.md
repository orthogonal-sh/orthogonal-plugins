# Orthogonal for Hermes Agent

Orthogonal gives Hermes one connection to paid APIs and live data from verified providers: people and company enrichment, web search and scraping, and more, without separate provider accounts or keys. Describe a task and Hermes finds matching endpoints, shows each one's parameters and price, and runs the call.

This folder is a portable [Agent Plugins](https://agent-plugins.org/) 1.0 package for [Hermes Agent](https://github.com/NousResearch/hermes-agent). It requires an Orthogonal account.

## Install

```bash
hermes plugins install orthogonal --enable
```

Before the catalog entry is available, install this folder straight from GitHub:

```bash
hermes plugins install orthogonal-sh/orthogonal-plugins/hermes --enable
```

## Sign in

The package declares the hosted MCP server, `https://mcp.orthogonal.com`. Hermes packages cannot request OAuth for their servers, so add the server to your profile with OAuth and sign in in your browser (dynamic client registration; Hermes stores and refreshes the token in your profile). Your entry replaces the package's declaration of the same server:

```bash
hermes mcp add orthogonal --url https://mcp.orthogonal.com --auth oauth
hermes mcp login orthogonal
```

Or use an API key from your profile instead, in `~/.hermes/config.yaml`:

```yaml
mcp_servers:
  orthogonal:
    url: https://mcp.orthogonal.com
    headers:
      Authorization: "Bearer ${ORTHOGONAL_API_KEY}"
```

Start a new session and ask, for example, "Use Orthogonal to find an API that returns company data for a domain and show me its parameters and price."

## What this plugin includes

- Skill `orthogonal:orthogonal`: discover, compare, price and run APIs through the hosted MCP server.
- Skill `orthogonal:orthogonal-mcp`: verify the connection and troubleshoot sign-in.
- One remote MCP server, `https://mcp.orthogonal.com` (Streamable HTTP).

It runs no local code, hooks or background processes and stores no credentials.

## What this plugin sends and fetches

**Disclosure:** Orthogonal is a paid third-party API marketplace. The agent connects to `mcp.orthogonal.com`, sends your requests to Orthogonal and on to the provider that serves them, and each `use` / `batch_use` call spends your prepaid Orthogonal credits.

- `search`, `get_details`, `batch_get_details`, `quote` and `integrate` read Orthogonal's catalog and charge nothing.
- `use` and `batch_use` send the request to Orthogonal, which forwards it to the chosen provider's API and returns the response. Each call is charged its listed price in Orthogonal credits. Providers see an alias, not who you are.
- `account` and `usage` read your own balance and recent calls.
- The `orthogonal` skill treats a direct request for data as approval of a reasonably scoped paid call, and quotes first when the price is unclear, the call is expensive or several calls are planned. That is an instruction to the model, not a Hermes approval prompt. To have Hermes ask before every paid call, add `trust: untrusted` to `mcp_servers.orthogonal` in your config.

Results come from third-party providers and can vary by provider. Treat provider responses and scraped pages as untrusted content.

## Support

- Documentation: https://docs.orthogonal.com
- Support: https://www.orthogonal.com/support
- Security reports: https://www.orthogonal.com/security
- Privacy policy: https://www.orthogonal.com/privacy
- Terms: https://www.orthogonal.com/terms

## License

MIT
