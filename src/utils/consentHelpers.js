/**
 * Consent Management Utility Functions
 * Helper functions for managing consent data and validation
 */

/**
 * Validates consent request data
 * @param {Object} consentData - The consent data to validate
 * @returns {Object} - Validation result with isValid boolean and errors array
 */
export const validateConsentRequest = (consentData) => {
  const errors = [];
  
  if (!consentData.documentHash) {
    errors.push('Document hash is required');
  }
  
  if (!consentData.documentType) {
    errors.push('Document type is required');
  }
  
  if (!consentData.requester) {
    errors.push('Requester information is required');
  }
  
  if (!consentData.expiryDate) {
    errors.push('Expiry date is required');
  }
  
  // Validate expiry date is in the future
  if (consentData.expiryDate && new Date(consentData.expiryDate) <= new Date()) {
    errors.push('Expiry date must be in the future');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Formats consent record for display
 * @param {Object} consentRecord - Raw consent record from blockchain
 * @returns {Object} - Formatted consent record
 */
export const formatConsentRecord = (consentRecord) => {
  return {
    id: consentRecord.id,
    documentHash: consentRecord.documentHash,
    documentType: consentRecord.documentType,
    requester: consentRecord.requester,
    status: consentRecord.status,
    createdAt: new Date(consentRecord.createdAt).toLocaleDateString(),
    expiryDate: consentRecord.expiryDate ? new Date(consentRecord.expiryDate).toLocaleDateString() : 'No expiry',
    permissions: consentRecord.permissions || []
  };
};

/**
 * Generates a unique consent ID
 * @returns {string} - Unique consent ID
 */
export const generateConsentId = () => {
  return `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Checks if consent is expired
 * @param {Object} consentRecord - Consent record to check
 * @returns {boolean} - True if consent is expired
 */
export const isConsentExpired = (consentRecord) => {
  if (!consentRecord.expiryDate) return false;
  return new Date(consentRecord.expiryDate) < new Date();
};

/**
 * Formats permissions array for display
 * @param {Array} permissions - Array of permission strings
 * @returns {string} - Formatted permissions string
 */
export const formatPermissions = (permissions) => {
  if (!permissions || permissions.length === 0) {
    return 'No specific permissions';
  }
  
  return permissions
    .map(permission => permission.replace(/_/g, ' ').toLowerCase())
    .join(', ');
}; 