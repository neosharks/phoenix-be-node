#!/bin/bash

# Update the package index
sudo apt update

# Install Node.js
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node.js installation
node --version

# Install PM2 globally
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Start Nginx
sudo systemctl start nginx

# Backup the original Nginx configuration file
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak

# Configure Nginx to listen on port 80 and set up reverse proxy
sudo bash -c 'cat > /etc/nginx/sites-available/default <<EOL
server {
    listen 80;
    listen [::]:80;

    server_name qalakar.com www.qalakar.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL'

# Test the Nginx configuration for syntax errors
sudo nginx -t

# Reload Nginx to apply the new configuration
sudo systemctl reload nginx

# Configure UFW firewall
sudo ufw enable
sudo ufw status
sudo ufw allow ssh 
sudo ufw allow http
sudo ufw allow https

# Install Certbot
sudo add-apt-repository ppa:certbot/certbot
sudo apt update
sudo apt install -y python3-certbot-nginx

# Obtain and configure SSL certificates with Certbot
sudo certbot --nginx -d qalakar.com -d www.qalakar.com

# Test the renewal process
sudo certbot renew --dry-run

# Install Yarn globally
sudo npm install -g yarn

# Navigate to your project directory (replace /path/to/your/project with the actual path)
cd /phoenix-be-node

# Install project dependencies with Yarn
yarn install

# Start your application with Yarn
yarn start

# Ensure the application is managed by PM2
pm2 start yarn --name "qalakar" -- start

# Save the PM2 process list and corresponding environments
pm2 save

# Ensure PM2 starts on boot
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME

echo "Setup completed successfully!"
