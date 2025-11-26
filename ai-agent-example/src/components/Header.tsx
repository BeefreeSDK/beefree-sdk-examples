
const Header = () => {
  return (
    <header className = "app-header" >
        <div className="header-content">
            <div className="header-left">
                <h1>🤖 AI Email Designer</h1>
                <p>Natural language email design powered by OpenAI Agents + Beefree MCP</p>
            </div>
            <a
                href="https://docs.beefree.io/beefree-sdk/early-access/beefree-sdk-mcp-server-beta"
                target="_blank"
                rel="noopener noreferrer"
                className="docs-link"
            >
                <span className="docs-icon">📚</span>
                <span className="docs-text">
                    <strong>MCP Server Docs</strong>
                    <small>Beta Documentation</small>
                </span>
            </a>
        </div>
    </header>
  )
}

export default Header