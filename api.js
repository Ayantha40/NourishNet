import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.7.0.184:8000',
});

export default api;
