import { useEffect, useRef, useState } from 'react'

export const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const footerRef = useRef<HTMLDivElement>(null)

  const handleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  useEffect(() => {
    if (isExpanded && footerRef.current) {
      footerRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isExpanded])

  return (
    <div className={`feature-showcase ${isExpanded ? 'expanded' : ''}`}>
      <h4 onClick={handleExpand} style={{ cursor: 'pointer' }}>
        🔀 Display Conditions Features {isExpanded ? '▲' : '▼'}
      </h4>
      {isExpanded && (
        <div className="feature-grid" >
          <div className="feature-card">
            <h3>🎯 Personalized Content</h3>
            <p>Show different content based on recipient attributes like customer tier, location, purchase history, or engagement level - all without writing code.</p>
          </div>
          <div className="feature-card">
            <h3>📋 Pre-configured Conditions</h3>
            <p>Provide users with ready-to-use conditions grouped by categories: Customer Segment, Geography, Shopping Behavior, Product Catalog, and Engagement.</p>
          </div>
          <div className="feature-card">
            <h3>🔍 Browse & Search</h3>
            <p>Users can browse conditions by category or search by keyword to quickly find the right condition for their personalization needs.</p>
          </div>
          <div className="feature-card">
            <h3>⚡ Any Templating Language</h3>
            <p>Language agnostic - use Liquid, Handlebars, or any proprietary syntax that matches your sending engine. The SDK doesn't parse the syntax.</p>
          </div>
          <div className="feature-card">
            <h3>✏️ Edit Conditions (Advanced)</h3>
            <p>Power users can edit the conditional syntax directly. Use permissions to control who can edit vs. who can only select pre-configured conditions.</p>
          </div>
          <div className="feature-card">
            <h3>👁️ Preview with Conditions</h3>
            <p>Toggle display conditions on/off in Preview mode to simulate what different recipient segments will see in their final emails.</p>
          </div>
          <div className="feature-card">
            <h3>🔒 Role-based Permissions</h3>
            <p>Control who can view, select, edit, or add conditions using roles and permissions. Some users can only select, others have full control.</p>
          </div>
          <div ref={footerRef}  className="feature-card">
            <h3>🏷️ Visual Indicators</h3>
            <p>Rows with applied conditions show a bifurcation icon. Custom conditions (edited from defaults) are marked with a blue dot for easy identification.</p>
          </div>
        </div>
      )}
    </div>
  )
}
