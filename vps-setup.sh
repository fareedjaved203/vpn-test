#!/bin/bash
# VPS Setup Script for VPN Application

echo "Setting up VPS for VPN Application..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install OpenVPN
sudo apt install -y openvpn

# Install Nginx
sudo apt install -y nginx

# Create application directory
sudo mkdir -p /var/www/vpn
sudo chown $USER:$USER /var/www/vpn

# Configure Nginx for IP access
sudo tee /etc/nginx/sites-available/default > /dev/null <<EOF
server {
    listen 80 default_server;
    
    # Frontend
    location / {
        root /var/www/html;
        try_files \$uri \$uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Reload Nginx
sudo systemctl reload nginx

# Configure PM2 to start on boot
pm2 startup
pm2 save

# Configure firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 1194/udp  # OpenVPN
sudo ufw --force enable

echo "VPS setup complete!"
echo "Next steps:"
echo "1. Upload your OpenVPN configuration to /var/www/vpn/backend/configs/"
echo "2. Configure GitHub secrets"
echo "3. Push your code to trigger deployment"