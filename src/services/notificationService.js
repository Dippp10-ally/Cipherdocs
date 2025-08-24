/**
 * Notification Service
 * Handles all notification-related functionality for the consent management system
 */

class NotificationService {
  constructor() {
    this.subscribers = new Set();
    this.notifications = [];
    this.isSupported = 'Notification' in window;
  }

  /**
   * Initialize notification service
   */
  async initialize() {
    if (this.isSupported) {
      const permission = await this.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission() {
    if (!this.isSupported) return 'denied';
    
    try {
      const permission = await Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  /**
   * Subscribe to notification events
   * @param {Function} callback - Callback function to handle notifications
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  /**
   * Notify all subscribers
   * @param {Object} notification - Notification object
   */
  notify(notification) {
    this.notifications.push({
      ...notification,
      id: this.generateId(),
      timestamp: new Date().toISOString()
    });

    this.subscribers.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });

    // Show browser notification if supported
    this.showBrowserNotification(notification);
  }

  /**
   * Show browser notification
   * @param {Object} notification - Notification object
   */
  showBrowserNotification(notification) {
    if (!this.isSupported || Notification.permission !== 'granted') {
      return;
    }

    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon || '/favicon.ico',
        badge: notification.badge || '/favicon.ico',
        tag: notification.tag || 'consent-notification',
        requireInteraction: notification.requireInteraction || false,
        silent: notification.silent || false
      });

      // Handle notification click
      browserNotification.onclick = () => {
        if (notification.onClick) {
          notification.onClick();
        }
        browserNotification.close();
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 5000);

    } catch (error) {
      console.error('Error showing browser notification:', error);
    }
  }

  /**
   * Generate unique notification ID
   */
  generateId() {
    return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all notifications
   */
  getNotifications() {
    return [...this.notifications];
  }

  /**
   * Clear all notifications
   */
  clearNotifications() {
    this.notifications = [];
  }

  /**
   * Remove specific notification
   * @param {string} id - Notification ID
   */
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   */
  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  /**
   * Send consent request notification
   * @param {Object} consentRequest - Consent request data
   */
  sendConsentRequestNotification(consentRequest) {
    this.notify({
      title: 'New Consent Request',
      message: `You have a new consent request for ${consentRequest.documentType} from ${consentRequest.requester}`,
      type: 'consent_request',
      data: consentRequest,
      onClick: () => {
        // Navigate to consent request page
        window.location.href = `/consent/${consentRequest.id}`;
      }
    });
  }

  /**
   * Send consent granted notification
   * @param {Object} consent - Consent data
   */
  sendConsentGrantedNotification(consent) {
    this.notify({
      title: 'Consent Granted',
      message: `Your consent for ${consent.documentType} has been granted successfully`,
      type: 'consent_granted',
      data: consent
    });
  }

  /**
   * Send consent revoked notification
   * @param {Object} consent - Consent data
   */
  sendConsentRevokedNotification(consent) {
    this.notify({
      title: 'Consent Revoked',
      message: `Your consent for ${consent.documentType} has been revoked`,
      type: 'consent_revoked',
      data: consent
    });
  }

  /**
   * Send consent expiry notification
   * @param {Object} consent - Consent data
   */
  sendConsentExpiryNotification(consent) {
    this.notify({
      title: 'Consent Expiring Soon',
      message: `Your consent for ${consent.documentType} will expire on ${new Date(consent.expiryDate).toLocaleDateString()}`,
      type: 'consent_expiry',
      data: consent,
      requireInteraction: true
    });
  }

  /**
   * Send error notification
   * @param {string} message - Error message
   * @param {Object} error - Error object
   */
  sendErrorNotification(message, error = null) {
    this.notify({
      title: 'Error',
      message: message,
      type: 'error',
      data: error,
      requireInteraction: true
    });
  }

  /**
   * Send success notification
   * @param {string} message - Success message
   */
  sendSuccessNotification(message) {
    this.notify({
      title: 'Success',
      message: message,
      type: 'success'
    });
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService; 