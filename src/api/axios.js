import axios from 'axios';

// Create an axios instance with the backend base URL
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
