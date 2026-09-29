import axios from 'axios';

/**
 * Centralized Axios configuration instance.
 * All HTTP requests in the application go through this client.
 * Talks to JSON Server running on http://localhost:5000.
 */
const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Request Interceptor: useful for logging or adding auth tokens in future
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: pass through response data directly or catch errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
