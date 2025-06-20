import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mern-backend-172407736127.us-central1.run.app/api',
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
//   baseURL: 'https://mern-backend-172407736127.us-central1.run.app', 
//   withCredentials: true, 
// });

// export default instance;

