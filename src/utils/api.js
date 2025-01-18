import axios from 'axios';

// Base URL for your backend API
const BASE_URL = "http://localhost:5000/api"; // Change to your server's URL

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Function to register a user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error.response?.data || 'Error registering user';
  }
};

// Function to login a user
export const loginUser = async (loginData) => {
  try {
    const response = await api.post('/auth/login', loginData);
    return response.data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error.response?.data || 'Error logging in user';
  }
};

// Function to get the current user (requires authentication)
export const getCurrentUser = async (token) => {
  try {
    const response = await api.get('/auth/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error.response?.data || 'Error fetching current user';
  }
};

// Function to fetch all users (admin-only)
export const getAllUsers = async (token) => {
  try {
    const response = await api.get('/admin/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error.response?.data || 'Error fetching users';
  }
};

// Function to delete a user (admin-only)
export const deleteUser = async (userId, token) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error.response?.data || 'Error deleting user';
  }
};

// Function to create a new user (admin-only)
export const createUser = async (userData, token) => {
  try {
    const response = await api.post('/admin/users', userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error.response?.data || 'Error creating user';
  }
};

// Function to update user details (admin-only)
export const updateUser = async (userId, userData, token) => {
  try {
    const response = await api.put(`/admin/users/${userId}`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error.response?.data || 'Error updating user';
  }
};

export default api;
