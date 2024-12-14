#!/bin/bash

# Install dependencies
npm install

# Install PM2 globally if not already installed
npm install -g pm2

# Start the application using PM2
pm2 start ecosystem.config.js

# Save PM2 process list and set to start on system boot
pm2 save
pm2 startup

# Display status
pm2 status