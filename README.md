# VPN Client Application

A full-stack VPN client application built with React (Vite) frontend and Node.js Express backend, integrated with OpenVPN.

## Features

- Single connect/disconnect button with loading states
- Connection timer tracking
- Server selection (Singapore server configured)
- UUID-based user identification (no login required)
- Real-time connection status

## Prerequisites

1. **OpenVPN Installation**:
   - Windows: Download from https://openvpn.net/community-downloads/
   - Add OpenVPN to your system PATH
   - Verify installation: `openvpn --version`

2. **Node.js** (v18 or higher)

## Setup Instructions

### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Configure OpenVPN

1. Replace `backend/configs/singapore.ovpn` with your actual .ovpn configuration file from your Singapore VPS
2. Ensure the .ovpn file includes all necessary certificates and keys
3. Update the server IP address in the configuration

### 3. Local Testing

**Start Backend:**
```bash
cd backend
npm run dev
```

**Start Frontend (in another terminal):**
```bash
cd frontend
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Testing Locally

### Method 1: Mock Testing (Recommended for Development)
- The current setup will work for UI testing
- OpenVPN commands will execute but may fail without proper server setup
- Check browser console and backend logs for connection attempts

### Method 2: Local OpenVPN Server
1. Set up a local OpenVPN server for testing
2. Generate test certificates and keys
3. Update the singapore.ovpn configuration

### Method 3: VPS Testing
1. Deploy the backend to your Singapore VPS
2. Update the frontend API endpoints to point to your VPS
3. Test the full connection flow

## File Structure

```
vpn/
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Styles
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── configs/
│   │   └── singapore.ovpn   # OpenVPN configuration
│   ├── logs/                # VPN connection logs
│   ├── server.js            # Express server
│   └── package.json
└── README.md
```

## API Endpoints

- `GET /api/servers` - Get available VPN servers
- `POST /api/connect` - Connect to VPN server
- `POST /api/disconnect` - Disconnect from VPN
- `GET /api/status/:userId` - Get connection status

## Deployment to VPS

1. **Backend Deployment:**
   - Copy backend files to your Singapore VPS
   - Install Node.js and OpenVPN on the VPS
   - Configure proper .ovpn files
   - Set up process manager (PM2)
   - Configure firewall rules

2. **Frontend Deployment:**
   - Build the frontend: `npm run build`
   - Deploy to web server or CDN
   - Update API endpoints to point to your VPS

## Security Notes

- This is a basic implementation for testing
- For production, implement proper authentication
- Use HTTPS for all communications
- Validate and sanitize all inputs
- Implement rate limiting and connection limits

## Troubleshooting

1. **OpenVPN not found**: Ensure OpenVPN is installed and in PATH
2. **Connection fails**: Check .ovpn configuration and server accessibility
3. **Permission errors**: Run with appropriate privileges for VPN operations
4. **Port conflicts**: Ensure ports 3000 and 5000 are available