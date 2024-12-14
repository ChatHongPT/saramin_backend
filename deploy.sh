#!/bin/bash

# Install dependencies
npm install

# Install PM2 globally if not installed
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
fi

# Start/Restart the application using PM2
pm2 startOrRestart ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup