import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const loginUser = async (credentials) => {
  const res = await axios.post(`${API}/auth/login`, credentials);
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axios.post(`${API}/auth/register`, userData);
  return res.data;
};
