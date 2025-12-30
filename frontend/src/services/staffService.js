import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Staff Management Service
 */
export const staffService = {
  /**
   * Get all staff members
   * @returns {Promise}
   */
  getAll: async () => {
    return apiClient.get(API_ENDPOINTS.STAFF_LIST);
  },

  /**
   * Get staff by ID
   * @param {string} staffId - Staff ID
   * @returns {Promise}
   */
  getById: async (staffId) => {
    return apiClient.get(API_ENDPOINTS.STAFF_GET(staffId));
  },

  /**
   * Create new staff member
   * @param {Object} staffData - Staff data
   * @returns {Promise}
   */
  create: async (staffData) => {
    return apiClient.post(API_ENDPOINTS.STAFF_LIST, staffData);
  },

  /**
   * Update staff member
   * @param {string} staffId - Staff ID
   * @param {Object} staffData - Updated staff data
   * @returns {Promise}
   */
  update: async (staffId, staffData) => {
    return apiClient.put(API_ENDPOINTS.STAFF_UPDATE(staffId), staffData);
  },

  /**
   * Delete staff member
   * @param {string} staffId - Staff ID
   * @returns {Promise}
   */
  delete: async (staffId) => {
    return apiClient.delete(API_ENDPOINTS.STAFF_DELETE(staffId));
  },
};

export default staffService;
