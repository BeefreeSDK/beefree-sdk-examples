# 📄 Template Export PDF Example - Advanced PDF Generation

This example demonstrates **advanced PDF export functionality** for the Beefree SDK using a modern **React + TypeScript** architecture. It showcases how to export templates as high-quality PDFs with comprehensive export options, progress tracking, and export history management.

## ✨ Key Features

### 📄 **Advanced PDF Export**
- **Multiple Export Options**: Page size (A4, Letter, Legal), orientation (Portrait/Landscape), quality settings
- **Template Format Support**: Both HTML and JSON template export
- **Real-time Progress Tracking**: Visual progress indicators during export
- **Export History**: Track and manage recent exports with success/failure status
- **Direct PDF Access**: Open exported PDFs in new browser tabs

### 🏗️ **Modern Architecture**
- **Self-Contained**: Runs its own backend server for authentication and PDF export
- **React 18 + TypeScript**: Type-safe component architecture
- **Vite**: Lightning-fast development server and build system
- **Custom Hooks**: `usePDFExport` for export state management
- **Concurrent Development**: Frontend and backend run simultaneously

### 🔐 **Secure Integration**
- **Beefree Content Services API**: Official PDF export API integration
- **Local Authentication**: Implements its own secure token generation endpoint
- **Environment-based Configuration**: Secure credential management

## 📁 Project Structure
```
template-export-pdf-example/
├── src/
│   ├── components/
│   │   ├── App.tsx              # Main React app component
│   │   ├── BeefreeEditor.tsx    # Beefree SDK integration
│   │   ├── PDFExportPanel.tsx   # Export controls and history
│   │   └── Header.tsx           # Application header
│   ├── hooks/
│   │   └── usePDFExport.ts      # Custom hook for export logic
│   ├── services/
│   │   ├── beefree.ts           # Beefree SDK service layer
│   │   └── pdfExport.ts         # PDF export service
│   ├── config/
│   │   ├── clientConfig.ts      # Beefree SDK configuration
│   │   └── constants.ts         # Application constants
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   ├── styles.css               # Application styles
│   └── index.tsx                # React entry point
├── server.js                    # Express.js backend (Auth + PDF API)
├── index.html                   # HTML entry point
├── vite.config.ts              # Vite + React configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── env.example                 # Environment variables template
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 22+ and Yarn
- Beefree SDK credentials (Client ID & Secret)

### Option 1: Run from Repository Root (Recommended)

The easiest way to run this example is using the start command from the repository root:

```bash
# From the beefree-sdk-examples root directory
yarn start:template-pdf
```

This single command will:
- ✅ Automatically install all dependencies
- ✅ Start both the frontend (port 8003) and backend server (port 3003) concurrently

Then open your browser to `http://localhost:8003`

**Before running**, make sure to configure your credentials in `template-export-pdf-example/.env`:

```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
BEEFREE_CS_API_URL=https://api.getbee.io
PORT=3003
VITE_PORT=8003
```

### Option 2: Run Manually (Advanced)

If you prefer to run the example independently:

#### 1. Install Dependencies

```bash
# In the template-export-pdf-example folder
yarn install
```

#### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
BEEFREE_CS_API_URL=https://api.getbee.io
PORT=3003
VITE_PORT=8003
```

#### 3. Start Development Environment

```bash
yarn start
```

This command starts both:
- **Frontend** (port 8003): React + Vite development server
- **Backend** (port 3003): Express.js server with Auth & PDF export API

Open your browser to `http://localhost:8003`

## 🚀 Available Scripts

```bash
yarn start      # Start development (client + server)
yarn dev        # Start frontend only
yarn server:dev # Start backend only
yarn build      # Build for production
yarn preview    # Preview production build
yarn type-check # Check TypeScript without emitting
```

## 🔐 Environment Variables

Required in `.env` file:
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
BEEFREE_CS_API_URL=https://api.getbee.io
PORT=3003
VITE_PORT=8003
```

**🚨 Security**: Never expose Client ID/Secret or API keys in frontend code. All credentials are handled server-side only.

## ⚛️ React + TypeScript Architecture

### Modern Stack
- **React 18**: Latest React with hooks and functional components
- **TypeScript**: Full type safety with strict configuration
- **Vite**: Lightning-fast development and optimized builds
- **Beefree SDK NPM**: Official `@beefree.io/sdk` package with TypeScript types
- **Custom Hooks**: `usePDFExport` for export state management
- **Service Layer**: Clean separation of concerns

### Key Technical Features
- **Official SDK Types**: Direct import from `@beefree.io/sdk/dist/types/bee`
- **Modern Initialization**: Uses `new BeefreeSDK(token)` constructor pattern
- **Type-Safe APIs**: Fully typed export options and responses
- **Component Architecture**: Modular, reusable UI components
- **State Management**: React hooks for complex export state
- **Error Boundaries**: Comprehensive error handling

### Benefits
- **Type Safety**: Compile-time error checking prevents runtime issues
- **Developer Experience**: IntelliSense, auto-completion, and refactoring
- **Performance**: React's virtual DOM + Vite's HMR for fast development
- **Maintainability**: Clear component boundaries and typed interfaces
- **Scalability**: Easy to extend with new export features
- **SDK Integration**: Leverages official Beefree SDK TypeScript support

## 🔧 Export Options
- **Page Size**: A4, Letter
- **Orientation**: Portrait, Landscape
- **Quality**: High, Medium, Low
- **Scale**: Custom scaling options (0.5 - 2.0)

## 📤 Export Flow
1. **Template Creation**: Create or modify email templates in Beefree SDK editor
2. **Export Configuration**: Select export options (size, orientation, quality)
3. **Export Trigger**: Click "Export to PDF" button
4. **Progress Tracking**: Real-time progress indicator with percentage
5. **Template Processing**: Backend calls Content Services API with template data
6. **PDF Generation**: Content Services API generates PDF with specified options
7. **Auto Download**: PDF automatically downloads to browser Downloads folder
8. **History Update**: Export added to history with timestamp and options

## 🧪 Testing

### Core Functionality
- **✅ Authentication**: Verify Beefree SDK loads with secure backend auth
- **✅ Template Editing**: Create or modify email templates
- **✅ Export Options**: Test all combinations of size, orientation, and quality
- **✅ PDF Export**: Verify PDF generation and download
- **✅ Progress Tracking**: Check real-time progress indicators
- **✅ Export History**: Verify history tracking and management

### Advanced Testing
- **✅ Error Handling**: Test with invalid credentials or network issues
- **✅ Large Templates**: Test export with complex, large templates
- **✅ Concurrent Exports**: Test multiple export requests
- **✅ Mobile Responsive**: Test on different screen sizes
- **✅ Accessibility**: Test keyboard navigation and screen readers

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Authentication failed" | Check `.env` credentials from [Beefree Developer Console](https://developers.beefree.io) |
| "Export failed" | Verify credentials and API permissions |
| "Server not running" | Run `yarn dev` and check port 3003 |
| "Template not saving" | Check browser console for onSave callback errors |
| "PDF not downloading" | Check browser download settings and popup blockers |
| "TypeScript errors" | Run `yarn type-check` to identify type issues |
| "Build fails" | Ensure all dependencies are installed with `yarn install` |

## 🌟 Production Notes

### Architecture
- **React + TypeScript**: Component-based structure with full type safety
- **Service Layer**: Clean separation between UI and business logic
- **Modern Build**: Vite provides optimized production builds with code splitting
- **API Integration**: Uses Beefree Content Services API with Bearer token authentication

### Performance
- **Code Splitting**: Automatic code splitting for optimal loading
- **Tree Shaking**: Unused code elimination in production builds
- **Asset Optimization**: Images and assets optimized during build
- **Progressive Enhancement**: Works without JavaScript for basic functionality

### Security
- **Server-side Credentials**: All API keys and secrets handled server-side only
- **CORS Configuration**: Properly configured cross-origin requests
- **Input Validation**: Server-side validation of all export parameters
- **Error Handling**: Comprehensive error handling without exposing sensitive data

### Scalability
- **Modular Components**: Easy to extend with new export formats
- **Configuration Management**: Centralized configuration with environment variables
- **Monitoring Ready**: Structured logging and health check endpoints

## 🔗 Related Examples

- [🔐 secure-auth-example](../secure-auth-example/) - Reference for authentication patterns
- [🎨 custom-css-example](../custom-css-example/) - React + TypeScript architecture reference

---

**💡 Pro Tip**: This example demonstrates the modern React + TypeScript approach for Beefree SDK integration. Use it as a foundation for building production applications with advanced PDF export capabilities.
