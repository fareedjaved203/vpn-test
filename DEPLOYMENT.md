# VPN Application Deployment Guide

## Step 1: Prepare Your VPS

### 1.1 Connect to your Singapore VPS
```bash
ssh root@YOUR_VPS_IP
```

### 1.2 Run the setup script
```bash
# Upload and run the setup script
chmod +x vps-setup.sh
./vps-setup.sh
```

### 1.3 Upload your OpenVPN configuration
```bash
# Copy your actual .ovpn file to the VPS
scp your-singapore-config.ovpn root@YOUR_VPS_IP:/var/www/vpn/backend/configs/singapore.ovpn
```

## Step 2: Configure GitHub Repository

### 2.1 Create GitHub Repository
1. Go to GitHub and create a new repository
2. Clone it locally or push your existing code

### 2.2 Set up GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VPS_HOST` | `YOUR_VPS_IP` | Your Singapore VPS IP address |
| `VPS_USERNAME` | `root` | SSH username (usually root) |
| `VPS_SSH_KEY` | `-----BEGIN PRIVATE KEY-----...` | Your SSH private key |
| `VPS_PORT` | `22` | SSH port (default 22) |

### 2.3 Generate SSH Key (if needed)
```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -C "github-actions"

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/id_rsa.pub root@YOUR_VPS_IP

# Copy private key content for GitHub secret
cat ~/.ssh/id_rsa
```

## Step 3: Deploy Your Application

### 3.1 Push to GitHub
```bash
git add .
git commit -m "Initial VPN application"
git push origin main
```

### 3.2 Monitor Deployment
1. Go to your GitHub repository
2. Click "Actions" tab
3. Watch the deployment process

## Step 4: Test Your Application

### 4.1 Access your application
- **Frontend**: http://YOUR_VPS_IP
- **Backend API**: http://YOUR_VPS_IP/api

### 4.2 Test VPN connection
1. Click "Connect" button
2. Check backend logs: `pm2 logs vpn-backend`
3. Verify OpenVPN process: `ps aux | grep openvpn`

## Troubleshooting

### Check backend status
```bash
pm2 status
pm2 logs vpn-backend
```

### Check Nginx status
```bash
sudo systemctl status nginx
sudo nginx -t
```

### Check OpenVPN
```bash
sudo systemctl status openvpn
tail -f /var/www/vpn/backend/logs/*.log
```

### Restart services
```bash
pm2 restart vpn-backend
sudo systemctl reload nginx
```

## File Locations on VPS

- **Application**: `/var/www/vpn/`
- **Frontend**: `/var/www/html/`
- **Backend**: `/var/www/vpn/backend/`
- **OpenVPN Config**: `/var/www/vpn/backend/configs/singapore.ovpn`
- **Logs**: `/var/www/vpn/backend/logs/`
- **Nginx Config**: `/etc/nginx/sites-available/default`