import AuditStorageManager from './auditStorageManager';

/**
 * Safe localStorage utility that handles quota exceeded errors
 * with automatic cleanup and retry logic
 */
export class SafeStorage {
  /**
   * Safely set an item in localStorage with automatic cleanup on quota errors
   */
  static setItem(key: string, value: any): boolean {
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.code === 22) {
        // QuotaExceededError - perform cleanup and retry
        console.warn(`⚠️ localStorage quota exceeded for key "${key}", performing cleanup...`);
        
        return this.cleanupAndRetry(key, value);
      } else {
        console.error(`❌ Failed to save to localStorage (${key}):`, error);
        return false;
      }
    }
  }

  /**
   * Safely get an item from localStorage with error handling
   */
  static getItem<T = any>(key: string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      
      // Try to parse as JSON, fallback to string
      try {
        return JSON.parse(item);
      } catch {
        return item as any;
      }
    } catch (error) {
      console.error(`❌ Failed to get from localStorage (${key}):`, error);
      return defaultValue;
    }
  }

  /**
   * Safely remove an item from localStorage
   */
  static removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`❌ Failed to remove from localStorage (${key}):`, error);
      return false;
    }
  }

  /**
   * Check storage space availability
   */
  static checkStorageSpace(): { available: boolean; sizeKB: number } {
    try {
      const testKey = 'storage_test';
      const testData = 'x'.repeat(1024); // 1KB test
      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);
      
      // Get current usage
      const storageInfo = AuditStorageManager.getStorageInfo();
      
      return {
        available: true,
        sizeKB: storageInfo.sizeKB
      };
    } catch (error) {
      return {
        available: false,
        sizeKB: 0
      };
    }
  }

  /**
   * Perform cleanup and retry saving
   */
  private static cleanupAndRetry(key: string, value: any): boolean {
    try {
      // Step 1: Clean up old audit entries
      const removedAuditCount = AuditStorageManager.cleanupOldEntries(12); // Keep only last 12 hours
      console.log(`🧹 Cleaned up ${removedAuditCount} old audit entries`);
      
      // Step 2: Clean up temporary/large storage keys
      const temporaryKeys = [
        'shared_documents',
        'access_granted', 
        'access_code',
        'user_documents',
        'temp_data',
        'cache_data'
      ];
      
      let cleanedKeys = 0;
      for (const tempKey of temporaryKeys) {
        if (tempKey !== key) { // Don't remove the key we're trying to save
          try {
            const data = localStorage.getItem(tempKey);
            if (data && data.length > 500) { // Remove if larger than 500 chars
              localStorage.removeItem(tempKey);
              cleanedKeys++;
              console.log(`🧹 Removed temporary storage key: ${tempKey}`);
            }
          } catch (cleanupError) {
            console.warn(`Failed to cleanup key ${tempKey}:`, cleanupError);
          }
        }
      }
      
      console.log(`🧹 Total cleanup: ${removedAuditCount} audit entries + ${cleanedKeys} storage keys`);
      
      // Step 3: Try saving again after cleanup
      try {
        const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
        console.log(`✅ Successfully saved "${key}" after cleanup`);
        return true;
      } catch (retryError) {
        console.error(`❌ Failed to save "${key}" even after cleanup:`, retryError);
        
        // Last resort: Show user-friendly message
        if (typeof window !== 'undefined') {
          alert(
            '⚠️ Storage space is full!' + '\\n\\n' +
            'Some features may not work properly.' + '\\n' +
            'Please clear your browser data or close other tabs and try again.'
          );
        }
        
        return false;
      }
    } catch (error) {
      console.error('❌ Failed during cleanup and retry:', error);
      return false;
    }
  }

  /**
   * Get storage usage statistics
   */
  static getUsageStats(): {
    totalEntries: number;
    auditEntries: number;
    sizeKB: number;
    nearQuota: boolean;
  } {
    try {
      const auditInfo = AuditStorageManager.getStorageInfo();
      const allKeys = Object.keys(localStorage);
      
      return {
        totalEntries: allKeys.length,
        auditEntries: auditInfo.entries,
        sizeKB: auditInfo.sizeKB,
        nearQuota: AuditStorageManager.isNearQuota()
      };
    } catch (error) {
      console.error('❌ Failed to get usage stats:', error);
      return {
        totalEntries: 0,
        auditEntries: 0,
        sizeKB: 0,
        nearQuota: false
      };
    }
  }
}

export default SafeStorage;