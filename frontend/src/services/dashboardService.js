import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Subscription Management Service
 */
export const subscriptionService = {
  /**
   * Get all subscriptions
   * @returns {Promise}
   */
  getAll: async () => {
    return apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS_LIST);
  },

  /**
   * Get subscription by ID
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise}
   */
  getById: async (subscriptionId) => {
    return apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS_GET(subscriptionId));
  },

  /**
   * Create new subscription
   * @param {Object} subscriptionData - Subscription data
   * @returns {Promise}
   */
  create: async (subscriptionData) => {
    return apiClient.post(API_ENDPOINTS.SUBSCRIPTIONS_CREATE, subscriptionData);
  },

  /**
   * Update subscription
   * @param {string} subscriptionId - Subscription ID
   * @param {Object} subscriptionData - Updated subscription data
   * @returns {Promise}
   */
  update: async (subscriptionId, subscriptionData) => {
    return apiClient.put(API_ENDPOINTS.SUBSCRIPTIONS_UPDATE(subscriptionId), subscriptionData);
  },

  /**
   * Delete subscription
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise}
   */
  delete: async (subscriptionId) => {
    return apiClient.delete(API_ENDPOINTS.SUBSCRIPTIONS_DELETE(subscriptionId));
  },
};

export default subscriptionService;
