# Orthogonal for Claude

Orthogonal gives Claude one connection to paid APIs and live data from verified providers: people and company enrichment, web search and scraping, and more, without separate provider accounts or keys. Describe a task and Claude finds matching endpoints, shows each one's parameters and price, and runs the call you approve.

This plugin works in Claude Code, Cowork and Claude chat. It requires an Orthogonal account; sign in through OAuth the first time the server connects.

## Install in Claude Code

```
/plugin install orthogonal --marketplace orthogonal-sh/orthogonal-plugins
```

## What this plugin includes

- Skill `orthogonal`: discover, compare, price and run APIs through the hosted MCP server.
- Skill `orthogonal-mcp`: verify the connection and troubleshoot sign-in.
- One remote MCP server, `https://mcp.orthogonal.com` (Streamable HTTP, OAuth 2.0).

It runs no local code, hooks or commands.

## What this plugin sends and fetches

- You sign in to Orthogonal in the browser through OAuth. No key or token is stored in this plugin.
- `search`, `get_details`, `batch_get_details`, `quote` and `integrate` read Orthogonal's catalog and charge nothing.
- `use` and `batch_use` send the request you approve to Orthogonal, which forwards it to the chosen provider's API and returns the response. Each call is charged its listed price in Orthogonal credits. Providers see an alias, not who you are.
- `account` and `usage` read your own balance and recent calls. `onboarding_tools`, `onboarding` and `payouts` are for teams that list their own APIs on Orthogonal.

Results come from third-party providers and can vary by provider. Treat provider responses and scraped pages as untrusted content.

## Example prompts

1. "Find an API on Orthogonal that returns a person's work email from their name and company, and tell me what it costs."
2. "How much would it cost to scrape https://example.com with Orthogonal?"
3. "What's my Orthogonal credit balance and recent usage?"

## Support

- Documentation: https://docs.orthogonal.com
- Support: https://www.orthogonal.com/support
- Security reports: https://www.orthogonal.com/security
- Privacy policy: https://www.orthogonal.com/privacy
- Terms: https://www.orthogonal.com/terms

## License

MIT
