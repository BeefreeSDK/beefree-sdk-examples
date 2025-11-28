# 💬 Beefree SDK Commenting Example

A practical, ready-to-run example demonstrating how to integrate the [**Beefree SDK Commenting feature**](https://docs.beefree.io/beefree-sdk/other-customizations/advanced-options/commenting) into your application. Built with **React 19 + TypeScript + Vite**, this example shows you exactly how to enable real-time collaboration, allowing your users to add comments, start threaded discussions, and manage feedback directly within the email builder.

**Perfect for developers who are:**
- 🆕 New to Beefree SDK and want to see commenting in action
- 📖 Learning how to implement the commenting API
- 🔨 Building a collaborative email editing platform
- 🎯 Looking for production-ready code patterns

> **📋 Plan Requirements**: The commenting feature is available on **Core**, **SuperPowers**, and **Enterprise** plans. It is **not available** on Free and Essentials plans. Check your plan in the [Beefree Developer Console](https://developers.beefree.io).

---

## ✨ Features Demonstrated

### 💬 **Core Commenting Capabilities**
- **Add Comments to Content** - Comment on any content block or row
- **Threaded Discussions** - Reply to comments and create conversation threads
- **Resolve & Reopen Threads** - Mark discussions as complete or reopen them
- **Edit & Delete Comments** - Users can modify or remove their own comments
- **Comment Preview** - Hover over comment icons to see the latest activity

### 🎯 **Interactive Demo Actions**
- **Toggle All Comments** - Show/hide the commenting panel with one click
- **Show Specific Comment** - Jump directly to a pre-loaded sample comment
- **Reviewer Role** - Switch to reviewer mode for comment-only access (no editing)
- **Real-time Notifications** - Toast notifications for all comment events

### 🔔 **Event Handling**
The demo handles all comment event types:
- 💬 `NEW_COMMENT` - New comment added
- ✏️ `COMMENT_EDITED` - Comment content updated
- 🗑️ `COMMENT_DELETED` - Comment removed
- ✅ `COMMENT_THREAD_RESOLVED` - Thread marked as complete
- 🔄 `COMMENT_THREAD_REOPENED` - Resolved thread reopened

### 🏗️ **Modern Architecture**
- **React 19** with functional components and hooks
- **TypeScript** for type safety and better developer experience
- **Vite** for fast development and optimized builds
- **Component-based** architecture for maintainability

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ and Yarn
- A Beefree SDK account with [Commenting enabled](https://docs.beefree.io/beefree-sdk/other-customizations/advanced-options/commenting#how-to-activate-it)
- Beefree SDK credentials

### Option 1: Run from Repository Root (Recommended)

The easiest way to run this example is using the start command from the repository root:

```bash
# From the beefree-sdk-examples root directory
yarn start:commenting
```

This single command will:
- ✅ Automatically install all dependencies
- ✅ Start the authentication server (port 3018)
- ✅ Start the commenting example (port 8018)

Then open your browser to `http://localhost:8018`

**Before running**, make sure to configure your Beefree SDK credentials in `commenting-example/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
PORT=3018
```

### Option 2: Run Manually (Advanced)

If you prefer to run the example independently, you need to manually start both the authentication server and the commenting example:

#### 1. Install Dependencies

```bash
cd commenting-example
yarn install
```

#### 2. Configure Environment

Create a `commenting-example/.env` file:

```bash
cp .env.example .env
```

Modify `commenting-example/.env`:

```env
# Beefree SDK Credentials (Backend Only)
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here

# Server Configuration
PORT=3018
VITE_PORT=8018
```

#### 3. Start the Application

You can start both the backend server and frontend client with a single command:

```bash
yarn start
```

Or run them separately in different terminals:

```bash
# Terminal 1: Backend Server
yarn server:dev

# Terminal 2: Frontend Client
yarn dev
```

Open your browser to `http://localhost:8018`

---

## 🎮 Using the Demo

### Main Demo Actions

#### 1. **Toggle All Comments**
Click the "💬 Toggle Comments" button in the header to show/hide the commenting panel.

#### 2. **Show Specific Comment**
Click the "🔍 Show Sample Comment" button to jump directly to the pre-loaded sample comment in the template.

#### 3. **Switch to Reviewer Role**
Click the "👁️ Switch to Reviewer" button to reload the page in reviewer mode. In this mode:
- ✅ Can view and add comments
- ✅ Can reply to existing comments
- ❌ Cannot edit content or design
- Perfect for stakeholder reviews and approvals

To return to editor mode, click "✏️ Switch to Editor".

### Adding Comments

1. Click on any content block or row
2. Click the comment balloon icon
3. Type your comment
4. Submit to see a real-time toast notification

### Viewing Comments

- Comment icons appear on blocks/rows with discussions
- Hover over the icon to see a preview
- Click to view the full thread
- Resolved comments are shown separately

---

## 🔧 Understanding the Configuration

### Basic SDK Configuration

Located in `src/config/clientConfig.ts`:

```typescript
export const clientConfig: IBeeConfig = {
  uid: 'commenting-demo-user',       // Unique identifier for this session
  container: 'bee-plugin-container', // DOM element ID where editor loads
  username: 'Demo User',             // Display name (shown in comments)
  userHandle: 'demo-user-123',       // Unique user ID (for your system)
  userColor: '#667eea',              // User's avatar color
  commenting: true                   // Enable commenting feature
}
```

### Where User Data Comes From

In a real application, these values typically come from your authentication system:

```typescript
// Example: Get from your logged-in user
const currentUser = getCurrentUser() // Your auth function

const beeConfig: IBeeConfig = {
  uid: `session-${Date.now()}`,
  container: 'bee-plugin-container',
  username: currentUser.fullName,
  userHandle: currentUser.id,
  userColor: currentUser.preferredColor || '#667eea',
  commenting: true
}
```

### Authentication Flow

This example uses a dedicated local server (`server.ts`) to handle credentials securely:

1. **Client** requests a token from `/auth/token` (proxied to local backend)
2. **Server** validates and creates a signed JWT token
3. **Client** uses token to initialize Beefree SDK
4. **Beefree SDK** validates token with Beefree servers

**Why?** Your API credentials (Client ID and Secret) should NEVER be exposed in client-side code.

---

## 📚 How It Works - Key Integration Points

### 1. **Enable Commenting in Your Beefree SDK Console**

Before using this feature, you must enable commenting in your [Beefree SDK Console](https://developers.beefree.io/):
1. Log in to your Beefree developer account
2. Click on your application's Details button
3. Go to Application > Configure Application
4. Scroll down to the Services section and toggle **"Commenting"** to ON (under Editing & Collaboration)
5. Save your changes

### 2. **Handle Comment Events with onComment**

The `onComment` callback is triggered for every comment action. This is where you implement your notification logic:

```typescript
onComment: (data: BeePluginOnCommentPayload) => {
  const changeType = data.change?.type
  const payload = data.change?.payload
  
  // React to different comment events:
  switch (changeType) {
    case 'NEW_COMMENT':
      // User added a new comment
      console.log('New comment:', payload.comment.content)
      break
    case 'COMMENT_EDITED':
      // User edited existing comment
      break
    case 'COMMENT_DELETED':
      // User deleted a comment
      break
    case 'COMMENT_THREAD_RESOLVED':
      // User marked thread as resolved
      break
    case 'COMMENT_THREAD_REOPENED':
      // User reopened a resolved thread
      break
  }
}
```

**See it in action:** Check `src/components/BeefreeEditor.tsx` for the complete implementation.

### 3. **Reviewer Role - Comment Without Editing**

Enable stakeholders to comment without modifying the design:

```typescript
const beeConfig: IBeeConfig = {
  ...yourConfig,
  role: 'reviewer'  // 'editor' (default) or 'reviewer'
}
```

**Reviewer capabilities:**
- ✅ View the design
- ✅ Add and reply to comments
- ✅ View comment threads
- ❌ Cannot edit content or structure

**See it in action:** Click "Switch to Reviewer" button in the demo header.

### 4. **Navigate to Specific Comments**

Jump directly to a comment programmatically using the `showComment` method:

```typescript
// Get the Beefree instance after initialization
const beeInstance = await initializeBeefreeSDK(config)

// Navigate to a specific comment by its ID
beeInstance.showComment('037e6427-bf55-4eed-aaa8-137381947130')
```

**Use case:** Deep linking from email notifications or external comment management systems.

### 5. **Pre-load Comments in Templates**

Include existing comments when loading a template:

```typescript
const templateWithComments = {
  page: { /* your page structure */ },
  comments: {
    "comment-uuid": {
      content: "This is a sample comment",
      parentCommentId: null,           // null = root comment
      elementId: "element-uuid",       // Which row/block
      mentions: [],                    // Array of mentioned users
      responses: [],                   // Array of reply IDs
      timestamp: "2025-11-12T17:44:07.843Z",
      author: {
        userHandle: "user-123",
        username: "John Doe",
        userColor: "#667eea"
      }
    }
  }
}
```

**See it in action:** Check `src/services/beefree.ts` - the `loadTemplate` function adds a sample comment automatically.

---

## 🎨 Customization

### Styling

All styles are in `src/styles.css`. Key sections:
- `.demo-header` - Header and demo controls
- `.toast-*` - Toast notification styling
- `.feature-showcase` - Footer feature cards

### Comment Events

Modify `src/components/BeefreeEditor.tsx` to customize how comment events are handled:

```typescript
onComment: (data) => {
  // Add your custom logic here
  // e.g., send to analytics, trigger webhooks, etc.
}
```

## 📦 Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn preview      # Preview production build
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint errors
yarn type-check   # Check TypeScript types
```

---

## 🐛 Troubleshooting

### Authentication Fails
**Solution:** Ensure the local backend server is running on port 3018 (or your configured port).
```bash
yarn server:dev
```

### Comments Not Appearing
**Solution:** 
1. Check that commenting is enabled in your Beefree SDK Console
2. Verify user credentials are provided (username, userHandle, userColor)
3. Check browser console for errors

### Reviewer Role Not Working
**Solution:** The page must be reloaded with `?role=reviewer` in the URL. The "Switch to Reviewer" button does this automatically.

### Toast Notifications Not Showing
**Solution:** Check that `onCommentEvent` prop is passed to `BeefreeEditor` and the toast container is rendered in `App.tsx`

---

## 🌟 Production Considerations

### Security
- **Server-side tokens only** - Never expose API credentials in client code
- **User validation** - Verify user identity before generating tokens
- **CORS configuration** - Properly configure cross-origin requests

### Scalability
- **Real-time sync** - Consider WebSocket integration for multi-user editing
- **Comment persistence** - Store comments in your database
- **Notification system** - Build email/Slack notifications for @mentions

### Performance
- **Code splitting** - Vite automatically optimizes bundle size
- **Lazy loading** - Consider lazy-loading the Beefree SDK
- **Caching** - Cache templates and user data appropriately

---

## 🔗 Related Resources

- **[Beefree SDK Commenting Documentation](https://docs.beefree.io/beefree-sdk/other-customizations/advanced-options/commenting)** - Official documentation
- **[Beefree SDK Console](https://developers.beefree.io/)** - Enable commenting for your application
- **[React Documentation](https://react.dev/)** - React best practices
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript guide
- **[Vite Documentation](https://vitejs.dev/)** - Vite configuration

---

## 🤝 Contributing

When contributing to this example:

1. **Maintain type safety** - Use TypeScript types throughout
2. **Test all comment workflows** - Add, edit, delete, resolve, reopen
3. **Update documentation** - Keep this README in sync with changes
4. **Follow conventions** - Match existing code style
5. **Test accessibility** - Ensure keyboard navigation and screen readers work

---

## 📄 License

This example is part of the Beefree SDK Examples repository.

---

## 💡 Tips & Best Practices

### Learning from This Example
- 📖 Read the code in `src/components/BeefreeEditor.tsx` to see SDK initialization
- 🔍 Check `src/services/beefree.ts` for authentication flow
- 💬 Examine the `onComment` callback implementation for event handling
- 🎨 Review how comment data structure works in the pre-loaded sample

### Next Steps for Your Integration
1. **Enable commenting** in your Beefree SDK Console
2. **Copy the initialization code** from `BeefreeEditor.tsx`
3. **Implement authentication** similar to `server.ts`
4. **Add user management** to populate username, userHandle, userColor
5. **Build notifications** in your `onComment` callback (email, Slack, etc.)
6. **Store comments** in your database for persistence
7. **Consider @mentions** for team collaboration features

### For Production Applications
- ✅ Never expose API credentials in client code
- ✅ Implement proper user authentication and authorization
- ✅ Store comment data in your backend database
- ✅ Build notification system for @mentions
- ✅ Consider WebSocket integration for real-time multi-user sync
- ✅ Add analytics to understand how users collaborate

---

**Need help?** Check the [Beefree SDK documentation](https://docs.beefree.io/) or [submit a support request](https://devportal.beefree.io/hc/en-us/requests/new).

**Found a bug?** Please report it in the [GitHub repository](https://github.com/BeefreeSDK/beefree-sdk-examples/issues).
