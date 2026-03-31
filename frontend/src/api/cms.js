import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// CMS APIs
export const cmsAPI = {
  // Top Bar
  getTopBar: async () => {
    const response = await api.get('/cms/topbar/');
    return response.data;
  },
  updateTopBar: async (data) => {
    const response = await api.put('/cms/topbar/', data);
    return response.data;
  },
  
  // Footer
  getFooter: async () => {
    const response = await api.get('/cms/footer/');
    return response.data;
  },
  updateFooter: async (data) => {
    const response = await api.put('/cms/footer/', data);
    return response.data;
  },
  
  // Homepage Settings
  getHomePageSettings: async () => {
    const response = await api.get('/cms/homepage/');
    return response.data;
  },
  updateHomePageSettings: async (data) => {
    const response = await api.put('/cms/homepage/', data);
    return response.data;
  },
  updateSectionVisibility: async (data) => {
    const response = await api.put('/cms/homepage/visibility', data);
    return response.data;
  },
};

export default api;
