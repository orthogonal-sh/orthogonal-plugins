# Orthogonal for Cursor and Grok Bot

Give your agents one integration for tools and fresh data.

This plugin connects Cursor and Grok Bot to Orthogonal's hosted Model Context Protocol (MCP) server. Agents can discover, call, and pay for API endpoints from verified providers without separate provider accounts or API keys.

## What it gives your agent

- **Discover:** Describe the capability or data you need and find matching API endpoints.
- **Call:** Use one consistent integration while Orthogonal handles provider credentials and routing.
- **Pay per request:** Use one Orthogonal balance and pay only for the calls your agent makes.
- **Reach fresh data:** Access tools for web search, company and contact data, enrichment, scraping, financial data, and more.

## Install from the Cursor Marketplace

The plugin must be published to the Cursor Marketplace before it appears in search.

### Cursor

1. Open **Customize** in Cursor.
2. Search for **Orthogonal**.
3. Select **Install** and choose a project or user scope.
4. Complete the Orthogonal sign-in when prompted.

### Grok Bot

1. Open **Plugins** in Grok Bot.
2. Search for **Orthogonal** and add it.
3. Select **Authorize** or **Authenticate**, then sign in to Orthogonal in your browser.
4. Confirm Orthogonal appears under **Installed**.

## Connect before Marketplace publication

Add the hosted server directly to your Cursor MCP configuration:

```json
{
  "mcpServers": {
    "orthogonal": {
      "url": "https://mcp.orthogonal.com"
    }
  }
}
```

Cursor supports this configuration in `.cursor/mcp.json` for a project or `~/.cursor/mcp.json` for your account.

## Authentication and billing

This plugin uses Orthogonal's OAuth sign-in and does not contain API keys or other secrets. API calls are metered through your Orthogonal account at the listed per-request price and consume your Orthogonal balance.

## Try it

Ask your agent to:

- Find an API for live web search.
- Look up company data for a domain.
- Find a tool that turns a LinkedIn profile URL into contact information.
- Compare providers for an enrichment task before making a paid call.

## Test the plugin locally

Clone this repository, then link it into Cursor's local plugin directory:

```sh
mkdir -p ~/.cursor/plugins/local
ln -s "$(pwd)" ~/.cursor/plugins/local/orthogonal
```

Restart Cursor or run **Developer: Reload Window**. Open **Customize** and confirm that Orthogonal and its MCP server appear.

## Validate

```sh
node scripts/validate-template.mjs
```

## Repository structure

```text
.
├── .cursor-plugin/
│   └── plugin.json
├── assets/
│   └── logo.jpg
├── mcp.json
└── scripts/
    └── validate-template.mjs
```

Built from Cursor's [plugin template](https://github.com/cursor/plugin-template).

## Support

- [Orthogonal MCP setup](https://docs.orthogonal.com/mcp/setup)
- [Orthogonal documentation](https://docs.orthogonal.com/)
- [Orthogonal](https://www.orthogonal.com/)

## License

MIT
