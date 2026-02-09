import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 8000,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (!config || !config.retry) {
      return Promise.reject(error);
    }

    const status = response?.status;
    const isRetryable = !response || status >= 500;
    config.__retryCount = config.__retryCount || 0;

    if (!isRetryable || config.__retryCount >= config.retry) {
      return Promise.reject(error);
    }

    config.__retryCount += 1;
    await sleep(400 * config.__retryCount);

    try {
      return await api.request(config);
    } catch (retryError) {
      return Promise.reject(retryError);
    }
  },
);

export default api;
