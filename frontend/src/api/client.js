import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Packages API
export const packagesAPI = {
  getAll: async (destination = null) => {
    const params = destination ? { destination } : {};
    const response = await api.get('/packages/', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },
  
  create: async (packageData) => {
    const response = await api.post('/packages/', packageData);
    return response.data;
  },
  
  update: async (id, packageData) => {
    const response = await api.put(`/packages/${id}`, packageData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  },
};

// Destinations API
export const destinationsAPI = {
  getAll: async () => {
    const response = await api.get('/destinations/');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/destinations/${id}`);
    return response.data;
  },
  
  create: async (destinationData) => {
    const response = await api.post('/destinations/', destinationData);
    return response.data;
  },
  
  update: async (id, destinationData) => {
    const response = await api.put(`/destinations/${id}`, destinationData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/destinations/${id}`);
    return response.data;
  },
};

// Banners API
export const bannersAPI = {
  getAll: async () => {
    const response = await api.get('/banners/');
    return response.data;
  },
  
  create: async (bannerData) => {
    const response = await api.post('/banners/', bannerData);
    return response.data;
  },
  
  update: async (id, bannerData) => {
    const response = await api.put(`/banners/${id}`, bannerData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/banners/${id}`);
    return response.data;
  },
};

// Settings API
export const settingsAPI = {
  get: async () => {
    const response = await api.get('/settings/');
    return response.data;
  },
  
  update: async (settingsData) => {
    const response = await api.put('/settings/', settingsData);
    return response.data;
  },
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

export default api;
