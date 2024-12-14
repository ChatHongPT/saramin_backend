#!/bin/bash

# Environment variables
export PORT=17085
export NODE_ENV=production

# Install dependencies
npm install

# Create logs directory if it doesn't exist
mkdir -p logs

# Start the server using PM2
npm install -g pm2
pm2 delete saramin-api || true
pm2 start src/server.js --name saramin-api

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup

echo "Deployment completed! Server is running on http://113.198.66.75:${PORT}/api-docs"