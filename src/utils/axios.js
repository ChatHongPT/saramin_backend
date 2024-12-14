import axios from 'axios';
import axiosRetry from 'axios-retry';

export function createAxiosInstance() {
  const instance = axios.create({
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    },
    timeout: 10000,
  });

  axiosRetry(instance, {
    retries: 3,
    retryDelay: (retryCount) => retryCount * 1000,
    retryCondition: (error) => {
      return (
        axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error)
      );
    },
  });

  return instance;
}
