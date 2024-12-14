#!/bin/bash

# Stop any existing PM2 processes
pm2 stop saramin-api || true
pm2 delete saramin-api || true

# Install dependencies
npm install

# Copy production environment file
cp .env.production .env

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 process list and set to start on system boot
pm2 save
pm2 startup

# Display status
pm2 status