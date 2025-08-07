#!/bin/bash
# Complete VPS Restore Script - Reinstalls everything from scratch

echo "=== VPS Complete Restore Script ==="
echo "This will install everything from scratch..."

# Update system
echo "1. Updating system..."
apt update && apt upgrade -y

# Install Node.js
echo "2. Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 globally
echo "3. Installing PM2..."
npm install -g pm2

# Install OpenVPN
echo "4. Installing OpenVPN..."
apt install -y openvpn

# Install Nginx
echo "5. Installing Nginx..."
apt install -y nginx

# Install Git
echo "6. Installing Git..."
apt install -y git

# Setup firewall SAFELY
echo "7. Setting up firewall (safely)..."
ufw --force reset
ufw allow ssh
ufw allow 22
ufw allow 80
ufw allow 1194/udp
ufw --force enable

# Clone your project
echo "8. Cloning project..."
cd ~
rm -rf vpn-test
git clone https://github.com/fareedjaved203/vpn-test vpn-test

# Install backend dependencies
echo "9. Installing backend dependencies..."
cd ~/vpn-test/backend
npm install

# Install frontend dependencies and build
echo "10. Installing frontend dependencies..."
cd ~/vpn-test/frontend
npm install
npm run build

# Configure Nginx
echo "11. Configuring Nginx..."
tee /etc/nginx/sites-available/default > /dev/null <<EOF
server {
    listen 80 default_server;
    
    location / {
        root /var/www/html;
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Deploy frontend
echo "12. Deploying frontend..."
cp -r ~/vpn-test/frontend/dist/* /var/www/html/

# Copy OpenVPN config (if exists)
echo "13. Setting up OpenVPN config..."
cd ~/vpn-test/backend
mkdir -p configs
if [ -f ~/singapore.ovpn ]; then
    cp ~/singapore.ovpn configs/singapore.ovpn
    echo "OpenVPN config copied from ~/singapore.ovpn"
else
    echo "WARNING: ~/singapore.ovpn not found. You'll need to set up OpenVPN server."
fi

# Start services
echo "14. Starting services..."
systemctl reload nginx
systemctl enable nginx

# Start backend with PM2
cd ~/vpn-test/backend
pm2 start server.js --name vpn-backend
pm2 startup
pm2 save

# Setup OpenVPN server (if singapore.ovpn doesn't exist)
if [ ! -f ~/singapore.ovpn ]; then
    echo "15. Setting up OpenVPN server automatically..."
    cd ~
    curl -O https://raw.githubusercontent.com/angristan/openvpn-install/master/openvpn-install.sh
    chmod +x openvpn-install.sh
    
    # Run OpenVPN setup with default answers
    echo "Running OpenVPN setup with defaults..."
    AUTO_INSTALL=y ./openvpn-install.sh
    
    # Find and rename the generated client config
    if [ -f ~/client.ovpn ]; then
        mv ~/client.ovpn ~/singapore.ovpn
        cp ~/singapore.ovpn ~/vpn-test/backend/configs/singapore.ovpn
        echo "OpenVPN server setup complete! client.ovpn renamed to singapore.ovpn and copied to configs!"
    elif [ -f ~/singapore.ovpn ]; then
        cp ~/singapore.ovpn ~/vpn-test/backend/configs/singapore.ovpn
        echo "OpenVPN server setup complete and config copied!"
    else
        echo "WARNING: No client config file found. Check OpenVPN setup."
    fi
    
    # Fix OpenVPN server config to prevent SSH disconnection
    echo "Fixing OpenVPN server routing to prevent SSH issues..."
    sed -i 's/^push "redirect-gateway def1 bypass-dhcp"/#push "redirect-gateway def1 bypass-dhcp"/' /etc/openvpn/server/server.conf
    systemctl restart openvpn-server@server || true
fi

echo "=== SETUP COMPLETE ==="
echo "Frontend: http://139.99.61.185"
echo "Backend: http://139.99.61.185/api"
echo ""
echo "Next steps:"
echo "1. If singapore.ovpn doesn't exist, run: ./openvpn-install.sh"
echo "2. Update GitHub repo URL in this script"
echo "3. Check services: pm2 status"
echo "4. Test your app!"