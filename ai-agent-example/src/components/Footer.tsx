import { useState } from 'react'

export const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={`feature-showcase ${isExpanded ? 'expanded' : ''}`}>
      <h2 onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
        🤖 AI Agent Features {isExpanded ? '▲' : '▼'}
      </h2>
      {isExpanded && (
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🎨 Natural Language Design</h3>
            <p>Create professional email designs using simple text commands. Tell the AI what you want and watch it build your email in real-time.</p>
          </div>
          <div className="feature-card">
            <h3>🔧 40+ MCP Tools</h3>
            <p>Powered by Model Context Protocol with 40+ specialized tools for sections, columns, content blocks, styling, and template management.</p>
          </div>
          <div className="feature-card">
            <h3>✅ Email Validation</h3>
            <p>Automatic checks for accessibility, broken links, and email best practices. AI ensures your emails are production-ready.</p>
          </div>
          <div className="feature-card">
            <h3>🎯 Smart Context Awareness</h3>
            <p>AI understands your design intent and suggests improvements. It works methodically through complex requests step-by-step.</p>
          </div>
        </div>
      )}
    </div>
  )
}
