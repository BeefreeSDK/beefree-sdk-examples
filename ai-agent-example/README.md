# 🤖 Beefree SDK AI Agent Example

A production-ready example demonstrating how to build an **AI-powered email design assistant** using the **Beefree SDK MCP Server** and **OpenAI Agents JS**. This example shows you how to create natural language interfaces for email design, allowing users to create and modify professional email templates through conversational AI.

**Perfect for developers who are:**
- 🤖 Building AI-powered design tools and assistants
- 📖 Learning how to integrate MCP servers with AI agents
- 🔨 Creating conversational interfaces for content creation
- 🎯 Looking for production-ready AI agent patterns

> **📋 Requirements**: This example requires access to the **Beefree SDK MCP Server (Beta)**. To request access, fill out the [beta survey](https://growens.typeform.com/to/gyH0gVgp#source=docs). You'll also need an OpenAI API key.

---

## ✨ Features Demonstrated

### 🤖 **AI-Powered Email Design**
- **Natural Language Commands** - Create emails using conversational instructions
- **Real-time Streaming** - See the AI work in real-time with streaming responses
- **MCP Integration** - Direct connection to Beefree's MCP server for editor control
- **Progress Updates** - AI provides status updates as it builds your email

### 🎨 **Email Design Capabilities**
The AI agent can:
- **Structure & Layout** - Create sections, manage columns, configure layouts
- **Content Blocks** - Add titles, paragraphs, images, buttons, icons, dividers
- **Styling** - Apply colors, fonts, spacing, and brand guidelines
- **Template Catalog** - Search and clone from 1,500+ pre-built templates
- **Validation** - Check for accessibility issues, broken links, and best practices
- **Stock Images** - Search and insert royalty-free images via Pexels API

### 💬 **Chat Interface**
- **Streaming Responses** - Real-time AI responses with visual feedback
- **Example Prompts** - Quick-start templates to demonstrate capabilities
- **Message History** - Full conversation context for iterative refinement
- **Error Handling** - Graceful error messages and recovery

### 🏗️ **Modern Architecture**
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express + TypeScript with WebSocket support
- **AI Agent**: OpenAI Agents JS with MCP client integration
- **Real-time**: WebSocket-based bidirectional communication

---

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ and Yarn
- A Beefree SDK account with MCP Server access (beta)
- OpenAI API key
- MCP-compatible CSAPI key from Beefree

### Option 1: Run from Repository Root (Recommended)

```bash
# From the beefree-sdk-examples root directory
yarn start:ai-agent
```

This single command will:
- ✅ Install all dependencies
- ✅ Start the backend server with AI agent (port 8083)
- ✅ Start the frontend development server (port 8081)

Then open your browser to `http://localhost:8081`

**Before running**, configure your credentials in `ai-agent-example/.env`:

```env
# Beefree SDK Credentials
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
BEEFREE_MCP_API_KEY=your_mcp_compatible_api_key_here
BEEFREE_UID=user_unique_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=8083
VITE_PORT=8081
```

### Option 2: Run Manually (Advanced)

#### 1. Install Dependencies

```bash
cd ai-agent-example
yarn install
```

#### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Beefree SDK Credentials
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
BEEFREE_MCP_API_KEY=your_mcp_compatible_api_key_here
BEEFREE_UID=user_unique_id

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=8083
VITE_PORT=8081
```

> **Important**: Your MCP API key must be MCP-compatible. Standard CSAPI keys will not work. Request access via the [beta survey](https://growens.typeform.com/to/gyH0gVgp#source=docs).

#### 3. Start Backend Server

In one terminal:

```bash
yarn server:dev
```

The backend server (AI agent + auth) runs on `http://localhost:8083`

#### 4. Start Frontend

In another terminal:

```bash
yarn dev
```

Open your browser to `http://localhost:8081`

---

## 🎮 Using the Demo

### Quick Examples

Try these example prompts to see the AI agent in action:

#### **Create a Newsletter**
```
Build a newsletter layout with a header, featured article, and 3-column content grid
```

#### **Design a Promotional Email**
```
Design a promotional email with product showcase, discount code, and urgency messaging
```

#### **Complete Product Launch**
```
Create a professional product launch email for our new AI-powered design tool. 
Include a hero section with the product image, feature highlights in a 3-column 
layout, customer testimonials, pricing tiers, and a strong CTA. Use #2563EB as 
primary color and #1E293B for text.
```

### How to Interact

1. **Type your request** in the chat input at the bottom
2. **Watch the AI work** - streaming responses show what it's doing
3. **See real-time updates** in the Beefree editor as the AI modifies the design
4. **Refine iteratively** - ask the AI to make changes to what it created

### What You Can Ask For

- **Structure**: "Add a 2-column section" or "Create a header with logo"
- **Content**: "Add a hero image" or "Insert a call-to-action button"
- **Styling**: "Make the background blue" or "Use modern typography"
- **Templates**: "Show me promotional email templates"
- **Validation**: "Check this email for accessibility issues"

---

## 🏗️ Architecture Overview

This example consists of three main components:

### 1. Frontend (React + TypeScript)
- **Beefree SDK Editor** - Visual email builder with MCP enabled
- **Chat Interface** - WebSocket-based communication with AI agent
- **Real-time Updates** - Streaming AI responses and editor synchronization

### 2. Backend Server (Express + TypeScript)
- **Authentication** - Secure token generation for Beefree SDK
- **WebSocket Server** - Real-time bidirectional communication
- **AI Agent Integration** - OpenAI Agents JS with MCP client

### 3. AI Agent (OpenAI Agents JS)
- **MCP Client** - Connects to Beefree's MCP server
- **Tool Execution** - 40+ tools for email design operations
- **Streaming Responses** - Real-time feedback to user

### Communication Flow

```
User Input → WebSocket → AI Agent → MCP Server → Beefree Editor
    ↑                         ↓
    ←─── Streaming Response ──┘
```

1. User types a natural language request
2. WebSocket sends message to backend
3. AI Agent processes request using MCP tools
4. MCP Server executes operations on editor
5. AI streams progress updates back to frontend
6. Editor updates in real-time

---

## 🔧 Configuration Details

### Beefree SDK Configuration

Located in `src/config/clientConfig.ts`:

```typescript
export const clientConfig: IBeeConfig = {
  container: 'bee-plugin-container',
  uid: 'ai-agent-user',
  mcpEditorClient: {
    enabled: true,                    // Enable MCP integration
    sessionId: 'ai-agent-session-001' // Unique session ID
  }
}
```

### MCP Session Configuration

The `sessionId` distinguishes multiple editor instances:

```typescript
const beeConfig: IBeeConfig = {
  uid: currentUser.id,
  container: 'bee-plugin-container',
  mcpEditorClient: {
    enabled: true,
    // Unique session ID - important when same user has multiple editors
    sessionId: `session-${Date.now()}-${Math.random()}`
  }
}
```

**Why sessionId matters:**
- Multiple browser tabs with same UID
- Multiple editor instances in one application
- Ensures MCP commands target the correct editor

### Authentication Flow

This example includes its own backend server for authentication:

1. **Frontend** requests token from `/api/auth/token`
2. **Backend** uses Beefree credentials to generate JWT
3. **Frontend** initializes Beefree SDK with token
4. **AI Agent** uses MCP API key to connect to MCP server

**Security:**
- Client ID and Secret stay on server
- MCP API key stays on server
- Frontend only receives temporary tokens
- OpenAI API key never exposed to client

---

## 📚 How It Works - Key Integration Points

### 1. **Get Access to MCP Server**

The MCP server is in beta and requires special access:
1. Fill out the [beta survey](https://growens.typeform.com/to/gyH0gVgp#source=docs)
2. Wait for Beefree team to enable MCP on your account
3. Receive an MCP-compatible CSAPI key
4. Standard CSAPI keys will NOT work with MCP

### 2. **Initialize AI Agent with MCP Client**

The backend creates an OpenAI agent with MCP integration:

```typescript
import { Agent } from '@openai/agents'
import { MCPClient } from '@openai/agents/mcp'

// Create MCP client pointing to Beefree's MCP server
const mcpClient = new MCPClient({
  url: 'https://api.getbee.io/v1/sdk/mcp',
  headers: {
    'Authorization': `Bearer ${process.env.BEEFREE_MCP_API_KEY}`,
    'x-bee-uid': userId,
    'x-bee-mcp-session-id': sessionId
  }
})

// Create agent with MCP tools
const agent = new Agent({
  name: 'Email Design Assistant',
  instructions: 'You help users create email designs...',
  tools: await mcpClient.listTools()
})
```

**See it in action:** Check `server.ts` for the complete implementation.

### 3. **WebSocket Communication**

Real-time bidirectional communication between frontend and AI:

```typescript
// Frontend sends user message
ws.send(JSON.stringify({
  type: 'chat',
  message: 'Create a welcome email'
}))

// Backend streams AI responses
ws.on('message', (data) => {
  const { type, content } = JSON.parse(data)
  
  switch (type) {
    case 'start':
      // AI started processing
      break
    case 'stream':
      // AI streaming response chunk
      appendToChat(content)
      break
    case 'complete':
      // AI finished
      break
  }
})
```

**See it in action:** Open browser console while chatting with AI.

### 4. **MCP Tool Execution**

The AI agent has access to 40+ MCP tools:

```typescript
// AI decides which tools to use based on user intent
await agent.run('Add a hero section with a CTA button')

// Behind the scenes, agent calls:
// 1. beefree_add_section
// 2. beefree_add_image
// 3. beefree_add_button
// 4. beefree_update_section_style
```

**Available tool categories:**
- Structure & Layout (sections, columns, rows)
- Content Blocks (text, images, buttons, etc.)
- Template Catalog (search, clone templates)
- Validation (accessibility, links, best practices)
- Stock Images (Pexels API integration)

### 5. **Streaming AI Responses**

Provide real-time feedback as AI works:

```typescript
// Backend streams responses
for await (const chunk of agent.stream(userMessage)) {
  ws.send(JSON.stringify({
    type: 'stream',
    content: chunk.text
  }))
}

// Frontend displays streaming text
function appendStreamingText(text: string) {
  messageDiv.textContent += text
  scrollToBottom()
}
```

**Benefits:**
- Users see AI "thinking" in real-time
- Long operations feel more responsive
- Users can stop if AI misunderstands
- Better user experience than waiting

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

### "Invalid MCP API Key" Error
**Solution:** 
1. Verify you have an MCP-compatible key (not a standard CSAPI key)
2. Check the key is correctly set in `.env`
3. Confirm you've been granted beta access

### AI Not Responding
**Solution:**
1. Check OpenAI API key is valid and has credits
2. Verify backend server is running: `http://localhost:8083`
3. Check browser console and server logs for errors
4. Ensure WebSocket connection is established

### Editor Not Updating
**Solution:**
1. Verify `mcpEditorClient.enabled: true` in config
2. Check UID and sessionId match between frontend and backend
3. Ensure Beefree SDK loaded successfully
4. Check network tab for MCP API calls

### "Connection Lost" Messages
**Solution:**
1. Backend server may have crashed - check terminal
2. WebSocket connection interrupted - refresh page
3. Check firewall/proxy settings blocking WebSockets

---

## 🌟 Production Considerations

### Security
- **API Key Management** - Use environment variables, never commit keys
- **Rate Limiting** - Implement rate limits for AI requests
- **User Authentication** - Verify user identity before allowing AI access
- **Input Validation** - Sanitize user prompts before sending to AI
- **CORS Configuration** - Properly configure cross-origin requests

### Scalability
- **WebSocket Management** - Handle connection pooling and reconnection
- **AI Request Queuing** - Queue requests during high load
- **Caching** - Cache templates and AI responses when appropriate
- **Database** - Store conversation history and user preferences

### Performance
- **Streaming Optimization** - Balance chunk size and frequency
- **Code Splitting** - Lazy load AI components
- **Token Management** - Monitor OpenAI token usage
- **MCP Connection Pooling** - Reuse MCP connections when possible

### Cost Management
- **Model Selection** - Use appropriate OpenAI models (GPT-4 vs GPT-3.5)
- **Token Optimization** - Keep system prompts concise
- **Usage Monitoring** - Track AI API costs per user
- **Fallback Options** - Handle API failures gracefully

---

## 🔗 Related Resources

**Beefree SDK & MCP:**
- **[Beefree SDK MCP Server Documentation](https://docs.beefree.io/beefree-sdk/early-access/beefree-sdk-mcp-server-beta)** - Official MCP documentation
- **[Beefree SDK Documentation](https://docs.beefree.io/beefree-sdk/)** - Complete SDK documentation
- **[Beefree SDK Console](https://developers.beefree.io/)** - Developer console and credentials
- **[Request MCP Beta Access](https://growens.typeform.com/to/gyH0gVgp#source=docs)** - Join the beta program

**OpenAI & AI Agents:**
- **[OpenAI Agents JS](https://github.com/openai/openai-agents-js)** - Agent framework documentation
- **[OpenAI Agents JS Docs](https://openai.github.io/openai-agents-js/)** - Complete API reference
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - MCP specification

**Technologies:**
- **[React Documentation](https://react.dev/)** - React best practices
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)** - TypeScript guide
- **[Vite Documentation](https://vitejs.dev/)** - Build tool configuration
- **[WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)** - WebSocket reference

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
- 📖 Read `server.ts` to understand AI agent setup and MCP integration
- 🔍 Check `src/components/App.tsx` for WebSocket communication patterns
- 🤖 Examine agent system prompts to see how to guide AI behavior
- 🎨 Review streaming implementation for real-time user feedback

### Next Steps for Your Integration
1. **Request MCP access** via the [beta survey](https://growens.typeform.com/to/gyH0gVgp#source=docs)
2. **Get OpenAI API key** from [OpenAI Platform](https://platform.openai.com/)
3. **Copy the agent setup** from `server.ts`
4. **Customize system prompts** to match your brand and use case
5. **Implement user authentication** and session management
6. **Add conversation history** storage in your database
7. **Build usage analytics** to track AI costs and user satisfaction
8. **Customize UI** to match your application design

### Prompt Engineering Tips
- **Be specific** - "Create a 3-column layout" vs "Make it look good"
- **Provide context** - Include brand colors, tone, target audience
- **Iterate** - Ask AI to refine what it created
- **Use examples** - "Like the Apple product launch emails"
- **Set constraints** - "Keep it under 600px wide for mobile"

### For Production Applications
- ✅ Implement proper error handling and retry logic
- ✅ Add rate limiting to prevent abuse
- ✅ Store conversation history for context
- ✅ Monitor AI costs and set usage limits per user
- ✅ Implement fallback UI when AI is unavailable
- ✅ Add user feedback mechanism (thumbs up/down)
- ✅ Track which prompts work best for analytics
- ✅ Consider fine-tuning models for your specific use case

---

**Need help?** Check the [Beefree SDK documentation](https://docs.beefree.io/) or [submit a support request](https://devportal.beefree.io/hc/en-us/requests/new).

**Found a bug?** Please report it in the [GitHub repository](https://github.com/BeefreeSDK/beefree-sdk-examples/issues).
