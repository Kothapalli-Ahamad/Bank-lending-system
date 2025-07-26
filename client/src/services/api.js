import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-api-url.com/api/v1'
  : '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Create a new loan
  createLoan: async (loanData) => {
    try {
      const response = await api.post('/loans', loanData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Record a payment
  recordPayment: async (loanId, paymentData) => {
    try {
      const response = await api.post(`/loans/${loanId}/payments`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Get loan ledger
  getLoanLedger: async (loanId) => {
    try {
      const response = await api.get(`/loans/${loanId}/ledger`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Get customer overview
  getCustomerOverview: async (customerId) => {
    try {
      const response = await api.get(`/customers/${customerId}/overview`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Network error' };
    }
  }
};

export default apiService;