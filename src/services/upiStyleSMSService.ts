interface SMSNotification {
  to: string;
  message: string;
  type: 'consent_request' | 'consent_approved' | 'consent_expired' | 'pin_setup';
}

interface ConsentRequest {
  documentName: string;
  requesterName: string;
  duration: number;
  accessCode: string;
}

class UPIStyleSMSService {
  private static instance: UPIStyleSMSService;
  private apiUrl = process.env.REACT_APP_SMS_API_URL || 'https://api.sms-service.com';
  private apiKey = process.env.REACT_APP_SMS_API_KEY || 'demo-key';

  static getInstance(): UPIStyleSMSService {
    if (!UPIStyleSMSService.instance) {
      UPIStyleSMSService.instance = new UPIStyleSMSService();
    }
    return UPIStyleSMSService.instance;
  }

  /**
   * Send consent request SMS (like UPI payment request)
   */
  async sendConsentRequest(
    phoneNumber: string, 
    request: ConsentRequest
  ): Promise<boolean> {
    const message = this.formatConsentRequestMessage(request);
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'consent_request'
    });
  }

  /**
   * Send consent approval confirmation (like UPI payment success)
   */
  async sendConsentApproval(
    phoneNumber: string,
    request: ConsentRequest
  ): Promise<boolean> {
    const message = `✅ ConsentChain: Access APPROVED for ${request.documentName} to ${request.requesterName} for ${request.duration} mins. Access Code: ${request.accessCode}. Do not share this code.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'consent_approved'
    });
  }

  /**
   * Send access expiry notification
   */
  async sendAccessExpiry(
    phoneNumber: string,
    documentName: string,
    requesterName: string
  ): Promise<boolean> {
    const message = `🔒 ConsentChain: Access to ${documentName} for ${requesterName} has EXPIRED. Your document is now secure.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'consent_expired'
    });
  }

  /**
   * Send PIN setup confirmation
   */
  async sendPinSetupConfirmation(phoneNumber: string): Promise<boolean> {
    const message = `🔐 ConsentChain: Your security PIN has been set successfully. You can now approve document access requests easily. Keep your PIN secure.`;
    
    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'pin_setup'
    });
  }

  /**
   * Send OTP for PIN reset (like UPI PIN reset)
   */
  async sendPinResetOTP(phoneNumber: string): Promise<string> {
    const otp = this.generateOTP();
    const message = `🔑 ConsentChain PIN Reset: Your OTP is ${otp}. Valid for 5 minutes. Do not share with anyone.`;
    
    await this.sendSMS({
      to: phoneNumber,
      message,
      type: 'pin_setup'
    });

    return otp;
  }

  /**
   * Format consent request message in Hindi + English (like UPI)
   */
  private formatConsentRequestMessage(request: ConsentRequest): string {
    return `📋 ConsentChain: ${request.requesterName} wants access to your ${request.documentName} for ${request.duration} minutes. 
    
Reply with:
✅ APPROVE to allow
❌ REJECT to deny

Or open ConsentChain app to respond.

Do not share this message.`;
  }

  /**
   * Core SMS sending function
   */
  private async sendSMS(notification: SMSNotification): Promise<boolean> {
    try {
      // For demo purposes, we'll just log the SMS
      // In production, integrate with SMS service like Twilio, MSG91, etc.
      console.log('📱 SMS Notification:', {
        to: `+91${notification.to}`,
        message: notification.message,
        type: notification.type,
        timestamp: new Date().toISOString()
      });

      // Simulate SMS API call
      const response = await fetch(`${this.apiUrl}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          to: `+91${notification.to}`,
          message: notification.message,
          type: notification.type
        })
      });

      if (!response.ok) {
        throw new Error('SMS sending failed');
      }

      // Store notification in local storage for demo
      this.storeNotificationLocally(notification);
      
      return true;
    } catch (error) {
      console.error('SMS sending error:', error);
      
      // Fallback: store locally for demo
      this.storeNotificationLocally(notification);
      return false;
    }
  }

  /**
   * Store notification locally for demo purposes
   */
  private storeNotificationLocally(notification: SMSNotification): void {
    const notifications = JSON.parse(localStorage.getItem('sms_notifications') || '[]');
    notifications.push({
      ...notification,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substr(2, 9)
    });
    localStorage.setItem('sms_notifications', JSON.stringify(notifications));
  }

  /**
   * Generate 6-digit OTP
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Get stored notifications for demo
   */
  getStoredNotifications(phoneNumber?: string): any[] {
    const notifications = JSON.parse(localStorage.getItem('sms_notifications') || '[]');
    
    if (phoneNumber) {
      return notifications.filter((n: any) => n.to === phoneNumber);
    }
    
    return notifications;
  }

  /**
   * Clear stored notifications
   */
  clearNotifications(): void {
    localStorage.removeItem('sms_notifications');
  }
}

// Export singleton instance
export const smsService = UPIStyleSMSService.getInstance();

// Export types
export type { SMSNotification, ConsentRequest };