export const Footer = () => {
  return (
    <div className="feature-showcase">
      <h2>💬 Commenting Features</h2>
      <div className="feature-grid">
        <div className="feature-card">
          <h3>💬 Add Comments & Threads</h3>
          <p>Add comments to any content block or row. Reply to existing comments to start threaded conversations with context always visible.</p>
        </div>
        <div className="feature-card">
          <h3>✅ Resolve & Reopen Threads</h3>
          <p>Mark threads as resolved when tasks are complete. Reopen solved threads if necessary to continue discussions.</p>
        </div>
        <div className="feature-card">
          <h3>👥 User Identification</h3>
          <p>Each user has unique username, userHandle (unique ID), and userColor. Configure via username, userHandle, and userColor parameters.</p>
        </div>
        <div className="feature-card">
          <h3>@ Mentions</h3>
          <p>Tag team members with @ mentions. Implement getMentions hook to provide user list and trigger notifications to mentioned users.</p>
        </div>
        <div className="feature-card">
          <h3>📝 Edit & Delete Comments</h3>
          <p>Users can edit or delete their own comments. Copy comment text and paste it directly into the content area for quick edits.</p>
        </div>
        <div className="feature-card">
          <h3>� onComment Callback</h3>
          <p>Handle NEW_COMMENT, COMMENT_EDITED, COMMENT_DELETED, COMMENT_THREAD_RESOLVED, and COMMENT_THREAD_REOPENED events to build notifications.</p>
        </div>
        <div className="feature-card">
          <h3>👁️ Reviewer Role</h3>
          <p>Set role: 'reviewer' to allow users to add comments without editing content. Perfect for stakeholder reviews and approvals.</p>
        </div>
        <div className="feature-card">
          <h3>🔗 Deep Linking</h3>
          <p>Use bee.showComment(commentId) to navigate directly to specific comments from notifications or external links.</p>
        </div>
      </div>
    </div>
  )
}
