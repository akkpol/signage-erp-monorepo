# NotebookLM MCP Server Setup Guide

This guide explains how to install and configure the **NotebookLM MCP Server** to integrate Google's NotebookLM with your AI tools (Claude Desktop, Cursor, etc.).

## 1. Prerequisites

- **Node.js**: Ensure you have Node.js installed (v18+).
- **Google Account**: You need access to [NotebookLM](https://notebooklm.google.com/).

## 2. Installation

We recommend using `npx` to run the server directly. This ensures you always use the latest version without manual updates.

### Test Installation

Open your terminal and run:

```powershell
npx -y notebooklm-mcp@latest --version
```

*If this prints a version number, you are ready to proceed.*

## 3. Configuration

### Option A: Claude Desktop App

1. Open your Claude Desktop config file:
    - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
    - **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the `notebooklm` entry to the `mcpServers` object:

```json
{
  "mcpServers": {
    "notebooklm": {
      "command": "npx",
      "args": [
        "-y",
        "notebooklm-mcp@latest"
      ]
    }
  }
}
```

1. Restart Claude Desktop.

### Option B: Cursor Editor

1. Open **Cursor Settings** -> **Features** -> **MCP Servers**.
2. Click **+ Add New MCP Server**.
3. Fill in the details:
    - **Name**: `notebooklm`
    - **Type**: `command`
    - **Command**: `npx -y notebooklm-mcp@latest`

## 4. Authentication (First Run)

When you first use a NotebookLM tool in your AI client:

1. The MCP server will attempt to authenticate.
2. A **Google Chrome** window (typically) will open automatically.
3. **Log in** to your Google account in that window.
4. Once logged in, the server will capture the session cookie and close the window (or you can close it).
5. Your AI agent will now have access to your notebooks!

## 5. Usage

You can now ask your AI agent to perform tasks like:

- *"Create a new notebook called 'Project Alpha Research'"*
- *"Add this PDF to my 'Project Alpha' notebook: [path/to/file.pdf]"*
- *"Summarize the sources in 'Project Alpha'"*
- *"What does the 'Q3 Report' source say about revenue?"*

## Troubleshooting

- **"Command not found"**: Ensure `npx` is in your system PATH.
- **Authentication Loop**: If Chrome doesn't open, try running `npx notebooklm-mcp@latest login` in your terminal manually.
