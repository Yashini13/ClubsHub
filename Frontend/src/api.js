import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

// Remove the token interceptor since we're using cookies
// The cookie will be automatically sent with each request

export default api;


// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'http://localhost:3000', 
//   withCredentials: true, 
// });

// export default instance;

