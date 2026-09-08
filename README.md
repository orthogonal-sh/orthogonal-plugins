# Orthogonal plugin for Cursor and Grok Bot

This repository contains the official Orthogonal plugin for Cursor and Grok Bot. It connects both products to Orthogonal's hosted MCP server so agents can search and call APIs from the Orthogonal marketplace.

## Install

After the plugin is published to the Cursor Marketplace:

### Cursor

1. Open **Customize** in Cursor.
2. Search for **Orthogonal**.
3. Select **Install** and choose a scope.
4. Select **Authenticate**, then sign in to Orthogonal in your browser.

### Grok Bot

1. Open **Plugins** in Grok Bot.
2. Search for **Orthogonal** and add it.
3. Select **Authenticate**, then sign in to Orthogonal in your browser.
4. Confirm Orthogonal appears under **Installed**.

## Test locally in Cursor

Clone the repository, then link the plugin directory into Cursor's local plugin directory:

```sh
mkdir -p ~/.cursor/plugins/local
ln -s "$(pwd)/plugins/orthogonal" ~/.cursor/plugins/local/orthogonal
```

Restart Cursor or run **Developer: Reload Window**. Open **Customize** and confirm that Orthogonal appears under installed plugins.

To test the MCP endpoint without the plugin, add this server to your Cursor MCP configuration:

```json
{
  "mcpServers": {
    "orthogonal": {
      "url": "https://mcp.orthogonal.com"
    }
  }
}
```

## Validate

Run:

```sh
node scripts/validate-template.mjs
```

## Repository structure

```text
.
├── .cursor-plugin/
│   └── marketplace.json
├── plugins/
│   └── orthogonal/
│       ├── .cursor-plugin/plugin.json
│       ├── assets/logo.svg
│       ├── mcp.json
│       └── README.md
└── scripts/
    └── validate-template.mjs
```

Built from Cursor's [plugin template](https://github.com/cursor/plugin-template).

## License

MIT
