import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Authentication Service
 */
export const authService = {
  /**
   * Register new user
   * @param {Object} userData - User data
   * @returns {Promise}
   */
  register: async (userData) => {
    return apiClient.post(API_ENDPOINTS.AUTH_REGISTER, userData);
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise}
   */
  login: async (email, password) => {
    return apiClient.post(API_ENDPOINTS.AUTH_LOGIN, { email, password });
  },

  /**
   * Get current user
   * @returns {Promise}
   */
  getCurrentUser: async () => {
    return apiClient.get(API_ENDPOINTS.AUTH_ME);
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Set auth token
   * @param {string} token - JWT token
   */
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
  },

  /**
   * Get auth token
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authService;
