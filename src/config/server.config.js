import dotenv from 'dotenv';

dotenv.config();

export const serverConfig = {
  port: process.env.PORT || 3000,
  externalUrl: 'http://113.198.66.75:13085',
  env: process.env.NODE_ENV || 'development',
  
  getSwaggerUrl() {
    return this.env === 'development' 
      ? `http://localhost:${this.port}/api-docs`
      : `${this.externalUrl}/api-docs`;
  },
  
  getApiUrl() {
    return this.env === 'development'
      ? `http://localhost:${this.port}/api`
      : `${this.externalUrl}/api`;
  }
};