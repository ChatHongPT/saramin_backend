#!/bin/bash

# Stop any running process on port 3000
echo "Stopping existing process on port 3000..."
kill $(lsof -t -i:3000) 2>/dev/null || true

# Install dependencies
echo "Installing dependencies..."
npm install

# Create logs directory if it doesn't exist
mkdir -p logs

# Set environment variables
echo "Setting up environment variables..."
export NODE_ENV=production
export PORT=3000
export MONGO_URI="mongodb+srv://test:test123@cluster0.vyeu8.mongodb.net/saramin_crawler"
export JWT_SECRET="saramin_jwt_secret_key_2023"
export JWT_REFRESH_SECRET="saramin_jwt_refresh_secret_key_2023"

# Start the server using PM2
echo "Starting server with PM2..."
npm install -g pm2
pm2 delete saramin-api 2>/dev/null || true
pm2 start src/server.js --name saramin-api

# Save PM2 process list
pm2 save

# Setup PM2 startup script
pm2 startup

echo "Deployment completed! Server is running at http://113.198.66.75:13085"
echo "API documentation available at http://113.198.66.75:13085/api-docs"