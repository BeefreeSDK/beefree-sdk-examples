# 🔐 Secure Authentication Example

Demonstrates **production-ready secure authentication** with Beefree SDK using backend token management and shared authentication module.

## 📖 Documentation Reference
- [Authorization Process](https://docs.beefree.io/beefree-sdk/getting-started/readme/installation/authorization-process-in-detail)
- [Installation Guide](https://docs.beefree.io/beefree-sdk/getting-started/readme/installation)

## 🎯 What This Example Shows
- ✅ **Secure server-side authentication** with Beefree SDK
- ✅ **Token management and automatic refresh**
- ✅ **Shared authentication module** (`../shared/auth.js`)
- ✅ **Proper credential handling** (never expose in frontend)
- ✅ **Error handling** for authentication failures
- ✅ **Production-ready architecture**

## 🚀 Key Features
- **🔒 Backend `/auth` endpoint**: Secure authentication using Client ID and Secret
- **🔄 Token refresh mechanism**: Automatic token renewal for 12-hour sessions
- **🛡️ Shared auth module**: Reusable authentication logic across examples
- **⚠️ Error handling**: Comprehensive error management and user feedback
- **🔐 Security best practices**: Environment variables, no frontend credential exposure
- **📱 Modern UI**: Clean, responsive interface with loading states

## 📁 Project Structure
```
secure-auth-example/
├── server.js           # Express.js backend with /auth endpoint
├── index.html          # Clean frontend interface
├── app.js             # Frontend Beefree SDK integration
├── .env               # Your Beefree SDK credentials
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
```

3. **Start the server**:
```bash
npm start
```

4. **Open in browser**:
```
http://localhost:3000
```

## 🔐 Security Architecture

### Backend Security
- ✅ Client ID and Secret stored server-side only
- ✅ Tokens requested from backend `/auth` endpoint
- ✅ Shared authentication module for consistency
- ✅ Environment variables for credential management
- ✅ CORS properly configured

### Frontend Security
- ✅ No credentials exposed in client code
- ✅ Tokens received from secure backend
- ✅ Automatic token refresh handling
- ✅ Proper error states and user feedback

## 🎮 Authentication Flow

1. **Frontend Request**: User clicks "Load Email Builder"
2. **Backend Authentication**: Server calls Beefree `/loginV2` with credentials
3. **Token Response**: Backend returns secure token to frontend
4. **SDK Initialization**: Frontend initializes Beefree SDK with token
5. **Auto Refresh**: SDK handles token refresh for 12-hour sessions

## 🧪 Testing

- **✅ Authentication**: Click "Load Email Builder" to test secure auth
- **✅ Editor Loading**: Verify Beefree SDK loads correctly
- **✅ Error Handling**: Test with invalid credentials to see error states
- **✅ Token Refresh**: Long sessions automatically refresh tokens

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Authentication failed" | Check `.env` credentials from [Beefree Developer Console](https://developers.beefree.io) |
| "Server not running" | Run `npm start` and check port 3000 |
| "CORS errors" | Ensure backend is running on localhost:3000 |
| "SDK not loading" | Check browser console for JavaScript errors |

## 🌟 Production Notes

- **Scalability**: Shared auth module enables consistent authentication across multiple examples
- **Security**: Never expose Client ID/Secret in frontend code or version control
- **Monitoring**: Add logging and monitoring for production deployments
- **Rate Limiting**: Consider rate limiting for the `/auth` endpoint
- **HTTPS**: Always use HTTPS in production environments
