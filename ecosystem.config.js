module.exports = {
  apps: [{
    name: 'saramin-api',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 13085,
      MONGO_URI: 'mongodb+srv://test:test123@cluster0.vyeu8.mongodb.net/saramin_crawler',
      JWT_SECRET: 'saramin_jwt_secret_key_2023',
      JWT_REFRESH_SECRET: 'saramin_jwt_refresh_secret_key_2023'
    }
  }]
};