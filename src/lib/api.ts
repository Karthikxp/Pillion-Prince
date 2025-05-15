import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const carApi = {
  getAllCars: async () => {
    const response = await api.get('/api/cars');
    return response.data;
  },

  getCarByModel: async (model: string) => {
    const response = await api.get(`/api/cars/${model}`);
    return response.data;
  },

  askQuestion: async (message: string, brand: string) => {
    const response = await api.post('/api/ask', { message, brand });
    return response.data;
  },

  listModels: async () => {
    const response = await api.get('/api/list-models');
    return response.data;
  },
}; 