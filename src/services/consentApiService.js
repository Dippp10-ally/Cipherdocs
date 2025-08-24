/**
 * Consent API Service
 * Handles all HTTP requests and API interactions for consent management
 */

class ConsentApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    if (token) {
      this.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.headers['Authorization'];
    }
  }

  /**
   * Make HTTP request with error handling
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   */
  async makeRequest(url, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        headers: this.headers,
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * Get all consents for a user
   * @param {string} userId - User ID
   * @param {Object} filters - Optional filters
   */
  async getConsents(userId, filters = {}) {
    const queryParams = new URLSearchParams({
      userId,
      ...filters,
    });

    return this.makeRequest(`/consents?${queryParams}`);
  }

  /**
   * Get consent by ID
   * @param {string} consentId - Consent ID
   */
  async getConsentById(consentId) {
    return this.makeRequest(`/consents/${consentId}`);
  }

  /**
   * Create new consent request
   * @param {Object} consentData - Consent request data
   */
  async createConsentRequest(consentData) {
    return this.makeRequest('/consents', {
      method: 'POST',
      body: JSON.stringify(consentData),
    });
  }

  /**
   * Update consent
   * @param {string} consentId - Consent ID
   * @param {Object} updates - Updates to apply
   */
  async updateConsent(consentId, updates) {
    return this.makeRequest(`/consents/${consentId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Grant consent
   * @param {string} consentId - Consent ID
   * @param {Object} permissions - Permissions to grant
   */
  async grantConsent(consentId, permissions = {}) {
    return this.makeRequest(`/consents/${consentId}/grant`, {
      method: 'POST',
      body: JSON.stringify({ permissions }),
    });
  }

  /**
   * Revoke consent
   * @param {string} consentId - Consent ID
   * @param {string} reason - Reason for revocation
   */
  async revokeConsent(consentId, reason = '') {
    return this.makeRequest(`/consents/${consentId}/revoke`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  /**
   * Delete consent
   * @param {string} consentId - Consent ID
   */
  async deleteConsent(consentId) {
    return this.makeRequest(`/consents/${consentId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get consent statistics
   * @param {string} userId - User ID
   */
  async getConsentStats(userId) {
    return this.makeRequest(`/consents/stats/${userId}`);
  }

  /**
   * Get consent history
   * @param {string} consentId - Consent ID
   */
  async getConsentHistory(consentId) {
    return this.makeRequest(`/consents/${consentId}/history`);
  }

  /**
   * Search consents
   * @param {Object} searchParams - Search parameters
   */
  async searchConsents(searchParams) {
    const queryParams = new URLSearchParams(searchParams);
    return this.makeRequest(`/consents/search?${queryParams}`);
  }

  /**
   * Bulk operations on consents
   * @param {Array} consentIds - Array of consent IDs
   * @param {string} operation - Operation to perform
   * @param {Object} data - Additional data for operation
   */
  async bulkConsentOperation(consentIds, operation, data = {}) {
    return this.makeRequest('/consents/bulk', {
      method: 'POST',
      body: JSON.stringify({
        consentIds,
        operation,
        data,
      }),
    });
  }

  /**
   * Export consents
   * @param {string} userId - User ID
   * @param {string} format - Export format (csv, json, pdf)
   * @param {Object} filters - Optional filters
   */
  async exportConsents(userId, format = 'json', filters = {}) {
    const queryParams = new URLSearchParams({
      userId,
      format,
      ...filters,
    });

    return this.makeRequest(`/consents/export?${queryParams}`, {
      method: 'GET',
    });
  }

  /**
   * Get consent templates
   */
  async getConsentTemplates() {
    return this.makeRequest('/consents/templates');
  }

  /**
   * Create consent template
   * @param {Object} templateData - Template data
   */
  async createConsentTemplate(templateData) {
    return this.makeRequest('/consents/templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  }

  /**
   * Update consent template
   * @param {string} templateId - Template ID
   * @param {Object} updates - Updates to apply
   */
  async updateConsentTemplate(templateId, updates) {
    return this.makeRequest(`/consents/templates/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete consent template
   * @param {string} templateId - Template ID
   */
  async deleteConsentTemplate(templateId) {
    return this.makeRequest(`/consents/templates/${templateId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get audit logs
   * @param {Object} filters - Optional filters
   */
  async getAuditLogs(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.makeRequest(`/audit-logs?${queryParams}`);
  }

  /**
   * Health check
   */
  async healthCheck() {
    return this.makeRequest('/health');
  }
}

// Create singleton instance
const consentApiService = new ConsentApiService();

export default consentApiService; 