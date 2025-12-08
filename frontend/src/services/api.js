import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000
});

export const fetchSales = async (params) => {
  try {
    const response = await api.get('/sales', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch sales data');
  }
};

export const fetchFilterOptions = async () => {
  try {
    const response = await api.get('/sales/filter-options');
    return response.data.filterOptions;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch filter options');
  }
};
