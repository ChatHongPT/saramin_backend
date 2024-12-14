export const DB_CONFIG = {
  CONNECTION_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 5,
  RETRY_DELAY: 5000,
  OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  },
};
