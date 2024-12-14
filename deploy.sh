#!/bin/bash

echo "Starting deployment..."

# Install Node.js dependencies
echo "Installing dependencies..."
npm install

# Create logs directory
echo "Creating logs directory..."
mkdir -p logs

# Install PM2 globally
echo "Installing PM2..."
npm install -g pm2

# Start the application with PM2
echo "Starting application with PM2..."
pm2 delete saramin-api 2>/dev/null || true
pm2 start src/server.js --name saramin-api

# Save PM2 process list and generate startup script
echo "Configuring PM2 startup..."
pm2 save

echo "Deployment completed! Server is running on http://113.198.66.75:17085/api-docs"