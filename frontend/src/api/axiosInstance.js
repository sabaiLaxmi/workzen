import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let activeRequests = 0;

const startRequest = () => {
  if (activeRequests === 0) {
    window.dispatchEvent(new Event('api-request-start'));
  }
  activeRequests++;
};

const endRequest = () => {
  activeRequests = Math.max(0, activeRequests - 1);
  if (activeRequests === 0) {
    window.dispatchEvent(new Event('api-request-end'));
  }
};

// Request interceptor to attach JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    startRequest();
    // We retrieve the token from localStorage which AuthContext will manage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    endRequest();
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized
axiosInstance.interceptors.response.use(
  (response) => {
    endRequest();
    return response;
  },
  (error) => {
    endRequest();
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
