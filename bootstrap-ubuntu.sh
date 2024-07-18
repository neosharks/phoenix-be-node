sudo apt update

curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs

node --version

sudo npm i pm2 -g

# Install Nginx
sudo apt install -y nginx

# Enable Nginx to start on boot
sudo systemctl enable nginx

# Start Nginx
sudo systemctl start nginx

# Backup the original Nginx configuration file
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak

# Configure Nginx to listen on port 80
sudo bash -c 'cat > /etc/nginx/sites-available/default <<EOL
 server_name qalakar.com www.qalakar.com;

    location / {
        proxy_pass http://localhost:3000; 
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
EOL'

# Test the Nginx configuration for syntax errors
sudo nginx -t

# Reload Nginx to apply the new configuration
sudo systemctl reload nginx


sudo ufw enable
sudo ufw status
sudo ufw allow ssh 
sudo ufw allow http
sudo ufw allow https 


sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python3-certbot-nginx
sudo certbot --nginx -d qalakar.com -d www.qalakar.com

# Only valid for 90 days, test the renewal process with
certbot renew --dry-run


npm i -g yarn

yarn


yarn start

