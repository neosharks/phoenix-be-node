#!/bin/bash

# Update package list and upgrade existing packages
sudo apt update
sudo apt upgrade -y

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

source ~/.bashrc

nvm install v16.20.2

node -v

npm i -g yarn

sudo apt install postgresql postgresql-contrib

sudo systemctl start postgresql.service