import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants/api';

/**
 * Dashboard Service
 */
export const dashboardService = {
  /**
   * Get dashboard statistics
   * @returns {Promise}
   */
  getStats: async () => {
    return apiClient.get(API_ENDPOINTS.DASHBOARD_STATS);
  },
};

export default dashboardService;
