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
- **React 18 + TypeScript**: Type-safe component architecture
- **Vite**: Lightning-fast development server and build system
- **Custom Hooks**: `usePDFExport` for export state management
- **Service Layer**: Clean separation of PDF export logic
- **Concurrent Development**: Frontend and backend run simultaneously

### 🔐 **Secure Integration**
- **Beefree Content Services API**: Official PDF export API integration
- **Shared Authentication**: Uses secure auth module from `secure-auth-example`
- **Environment-based Configuration**: Secure credential management

## 📁 Project Structure
```
template-export-pdf-example/
├── src/
│   ├── components/
│   │   ├── App.tsx              # Main React app component
│   │   ├── BeefreeEditor.tsx    # Beefree SDK integration
│   │   ├── PDFExportPanel.tsx   # Export controls and history
│   │   ├── Header.tsx           # Application header
│   │   └── Footer.tsx           # Application footer
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
│   └── main.tsx                 # React entry point
├── server.js                    # Express.js backend with PDF export API
├── index.html                   # HTML entry point
├── vite.config.ts              # Vite + React configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── env.example                 # Environment variables template
└── README.md                   # This file

../shared/
└── auth.js                     # Shared authentication module
```

## 🛠️ Quick Start

1. **Install dependencies**:
```bash
yarn install
```

2. **Configure credentials**:
```bash
cp env.example .env
# Edit .env with your Beefree SDK credentials from https://developers.beefree.io
# Add your Content Services API key
```

3. **Start development environment**:
```bash
yarn dev
```
This runs both the React development server and the Express backend concurrently.

4. **Open in browser**:
```
http://localhost:5174
```

## 🚀 Available Scripts

```bash
yarn dev        # Start development (client + server)
yarn start          # Build and start production server
yarn server     # Start Express.js backend only
yarn client     # Start Vite development server only
yarn build      # Build for production
yarn preview    # Preview production build
yarn type-check # Check TypeScript without emitting
```

## 🔐 Environment Variables

Required in `.env` file:
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
BEEFREE_CS_API_KEY=your_content_services_api_key_here
BEEFREE_CS_API_URL=https://api.getbee.io
PORT=3001
VITE_PORT=5174
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
| "Export failed" | Verify `BEEFREE_CS_API_KEY` is valid and has export permissions |
| "Server not running" | Run `npm run dev` or `npm run server` and check port 3001 |
| "Template not saving" | Check browser console for onSave callback errors |
| "PDF not downloading" | Check browser download settings and popup blockers |
| "TypeScript errors" | Run `npm run type-check` to identify type issues |
| "Build fails" | Ensure all dependencies are installed with `npm install` |

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
- **Shared Authentication**: Consistent auth module across all examples
- **Modular Components**: Easy to extend with new export formats
- **Configuration Management**: Centralized configuration with environment variables
- **Monitoring Ready**: Structured logging and health check endpoints

## 🔗 Related Examples

- [🔐 secure-auth-example](../secure-auth-example/) - Authentication foundation used by this example
- [🎨 custom-css-example](../custom-css-example/) - React + TypeScript architecture reference
- [🔧 shared/auth.js](../shared/) - Shared authentication module

---

**💡 Pro Tip**: This example demonstrates the modern React + TypeScript approach for Beefree SDK integration. Use it as a foundation for building production applications with advanced PDF export capabilities.