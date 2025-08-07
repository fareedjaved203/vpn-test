#!/bin/bash
echo "Installing VPN Application dependencies..."

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies and build
echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    exit 1
fi

echo "Building frontend..."
npm run build

# Copy frontend to nginx
echo "Deploying frontend..."
sudo cp -r dist/* /var/www/html/

# Start backend
echo "Starting backend..."
cd ../backend
pm2 start server.js --name vpn-backend
pm2 save

echo "Application deployed successfully!"
echo "Frontend: http://YOUR_VPS_IP"
echo "Backend: http://YOUR_VPS_IP/api"
echo "Check status: pm2 status"