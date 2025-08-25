# 📄 Template Export PDF Example

Demonstrates **production-ready PDF export** for Beefree SDK templates using the Beefree Content Services API with auto-download functionality and shared authentication.

## 📖 Documentation Reference
- [Content Services API](https://docs.beefree.io/beefree-sdk/apis/content-services-api)
- [Export to PDF](https://docs.beefree.io/beefree-sdk/apis/content-services-api/export)

## 🎯 What This Example Shows
- ✅ **PDF export** for Beefree SDK templates via Content Services API
- ✅ **Auto-download functionality** to browser Downloads folder
- ✅ **Shared authentication module** (`../shared/auth.js`)
- ✅ **Export options** (page size, orientation, quality, scale)
- ✅ **Production-ready error handling** and user feedback
- ✅ **onSave callback integration** for reliable template data retrieval

## 🚀 Key Features
- **📄 PDF Export**: Convert Beefree templates to PDF using Content Services API
- **⚙️ Export Options**: Page size (A4, Letter), orientation (Portrait/Landscape), quality settings
- **📥 Auto-Download**: Direct download to browser Downloads folder
- **🔒 Secure Authentication**: Backend API key management with shared auth module
- **💾 Template Integration**: Uses onSave callback for reliable template data retrieval
- **⚠️ Error Handling**: Comprehensive error management and user feedback
- **📱 Modern UI**: Clean, responsive interface with export management panel

## 📁 Project Structure
```
template-export-pdf-example/
├── server.js           # Express.js backend with PDF export API
├── index.html          # Frontend interface with export panel
├── app.js             # Beefree SDK integration + export management
├── pdf-exporter.js    # PDF export utility class
├── .env               # Your Beefree SDK credentials + CS API key
├── .env.example       # Environment variables template
├── package.json       # Dependencies and scripts
└── README.md          # This file

../shared/
└── auth.js            # Shared authentication module
```

## 🛠️ Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Configure credentials**:
```bash
cp .env.example .env
# Edit .env with your Beefree SDK credentials from https://developers.beefree.io
# Add your Content Services API key
```

3. **Start the server**:
```bash
npm start
```

4. **Open in browser**:
```
http://localhost:3001
```

## 🔐 Environment Variables

Required in `.env` file:
```env
BEEFREE_CLIENT_ID=your_client_id_here
BEEFREE_CLIENT_SECRET=your_client_secret_here
BEEFREE_CS_API_KEY=your_content_services_api_key_here
BEEFREE_CS_API_URL=https://api.getbee.io
PORT=3001
```

**🚨 Security**: Never expose Client ID/Secret or API keys in frontend code.

## 🔧 Export Options
- **Page Size**: A4, Letter
- **Orientation**: Portrait, Landscape
- **Quality**: High, Medium, Low
- **Scale**: Custom scaling options

## 📤 Export Flow
1. **Template Loading**: Load template in Beefree SDK editor
2. **Export Trigger**: Click "Export to PDF" button
3. **Template Save**: Uses onSave callback to get template data
4. **PDF Generation**: Backend calls Content Services API
5. **Auto Download**: PDF automatically downloads to browser

## 🧪 Testing

- **✅ Authentication**: Verify Beefree SDK loads with secure backend auth
- **✅ Template Editing**: Create or modify email templates
- **✅ PDF Export**: Test export with different options
- **✅ Auto Download**: Verify PDF downloads to Downloads folder
- **✅ Error Handling**: Test with invalid credentials or network issues

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Authentication failed" | Check `.env` credentials from [Beefree Developer Console](https://developers.beefree.io) |
| "Export failed" | Verify `BEEFREE_CS_API_KEY` is valid |
| "Server not running" | Run `npm start` and check port 3001 |
| "Template not saving" | Check browser console for onSave callback errors |
| "PDF not downloading" | Check browser download settings and popup blockers |

## 🌟 Production Notes

- **API Integration**: Uses Beefree Content Services API with Bearer token authentication
- **Template Data**: Reliable template retrieval via onSave callback pattern
- **Security**: API keys managed server-side with shared authentication module
- **Performance**: Direct PDF download without intermediate polling
- **Scalability**: Shared auth module enables consistent authentication across examples
