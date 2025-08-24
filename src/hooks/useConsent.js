import { useState, useEffect, useCallback } from 'react';
import { validateConsentRequest, formatConsentRecord, generateConsentId } from '../utils/consentHelpers';
import notificationService from '../services/notificationService';

/**
 * Custom hook for managing consent state and operations
 * @param {Object} initialConsents - Initial consent data
 * @returns {Object} - Consent state and operations
 */
const useConsent = (initialConsents = []) => {
  const [consents, setConsents] = useState(initialConsents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedConsent, setSelectedConsent] = useState(null);

  /**
   * Add a new consent request
   * @param {Object} consentData - Consent request data
   */
  const addConsentRequest = useCallback(async (consentData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate consent data
      const validation = validateConsentRequest(consentData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Generate unique ID
      const newConsent = {
        id: generateConsentId(),
        ...consentData,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to state
      setConsents(prev => [...prev, newConsent]);

      // Send notification
      notificationService.sendConsentRequestNotification(newConsent);

      return newConsent;
    } catch (err) {
      setError(err.message);
      notificationService.sendErrorNotification('Failed to create consent request', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Grant consent
   * @param {string} consentId - Consent ID to grant
   * @param {Object} permissions - Permissions to grant
   */
  const grantConsent = useCallback(async (consentId, permissions = []) => {
    try {
      setLoading(true);
      setError(null);

      setConsents(prev => prev.map(consent => {
        if (consent.id === consentId) {
          const updatedConsent = {
            ...consent,
            status: 'GRANTED',
            permissions,
            grantedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Send notification
          notificationService.sendConsentGrantedNotification(updatedConsent);

          return updatedConsent;
        }
        return consent;
      }));

      notificationService.sendSuccessNotification('Consent granted successfully');
    } catch (err) {
      setError(err.message);
      notificationService.sendErrorNotification('Failed to grant consent', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Revoke consent
   * @param {string} consentId - Consent ID to revoke
   */
  const revokeConsent = useCallback(async (consentId) => {
    try {
      setLoading(true);
      setError(null);

      setConsents(prev => prev.map(consent => {
        if (consent.id === consentId) {
          const updatedConsent = {
            ...consent,
            status: 'REVOKED',
            revokedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          // Send notification
          notificationService.sendConsentRevokedNotification(updatedConsent);

          return updatedConsent;
        }
        return consent;
      }));

      notificationService.sendSuccessNotification('Consent revoked successfully');
    } catch (err) {
      setError(err.message);
      notificationService.sendErrorNotification('Failed to revoke consent', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update consent
   * @param {string} consentId - Consent ID to update
   * @param {Object} updates - Updates to apply
   */
  const updateConsent = useCallback(async (consentId, updates) => {
    try {
      setLoading(true);
      setError(null);

      setConsents(prev => prev.map(consent => {
        if (consent.id === consentId) {
          return {
            ...consent,
            ...updates,
            updatedAt: new Date().toISOString()
          };
        }
        return consent;
      }));

      notificationService.sendSuccessNotification('Consent updated successfully');
    } catch (err) {
      setError(err.message);
      notificationService.sendErrorNotification('Failed to update consent', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete consent
   * @param {string} consentId - Consent ID to delete
   */
  const deleteConsent = useCallback(async (consentId) => {
    try {
      setLoading(true);
      setError(null);

      setConsents(prev => prev.filter(consent => consent.id !== consentId));

      notificationService.sendSuccessNotification('Consent deleted successfully');
    } catch (err) {
      setError(err.message);
      notificationService.sendErrorNotification('Failed to delete consent', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get consent by ID
   * @param {string} consentId - Consent ID
   */
  const getConsentById = useCallback((consentId) => {
    return consents.find(consent => consent.id === consentId);
  }, [consents]);

  /**
   * Get consents by status
   * @param {string} status - Status to filter by
   */
  const getConsentsByStatus = useCallback((status) => {
    return consents.filter(consent => consent.status === status);
  }, [consents]);

  /**
   * Get consents by document type
   * @param {string} documentType - Document type to filter by
   */
  const getConsentsByDocumentType = useCallback((documentType) => {
    return consents.filter(consent => consent.documentType === documentType);
  }, [consents]);

  /**
   * Get formatted consents
   */
  const getFormattedConsents = useCallback(() => {
    return consents.map(consent => formatConsentRecord(consent));
  }, [consents]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Select consent
   * @param {string} consentId - Consent ID to select
   */
  const selectConsent = useCallback((consentId) => {
    const consent = getConsentById(consentId);
    setSelectedConsent(consent);
  }, [getConsentById]);

  /**
   * Clear selected consent
   */
  const clearSelectedConsent = useCallback(() => {
    setSelectedConsent(null);
  }, []);

  // Initialize notification service
  useEffect(() => {
    notificationService.initialize();
  }, []);

  return {
    // State
    consents,
    loading,
    error,
    selectedConsent,
    
    // Actions
    addConsentRequest,
    grantConsent,
    revokeConsent,
    updateConsent,
    deleteConsent,
    
    // Getters
    getConsentById,
    getConsentsByStatus,
    getConsentsByDocumentType,
    getFormattedConsents,
    
    // Utilities
    clearError,
    selectConsent,
    clearSelectedConsent,
    
    // Computed values
    pendingConsents: getConsentsByStatus('PENDING'),
    grantedConsents: getConsentsByStatus('GRANTED'),
    revokedConsents: getConsentsByStatus('REVOKED'),
    totalConsents: consents.length
  };
};

export default useConsent; 