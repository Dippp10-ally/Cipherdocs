// localStorage utility for audit trail management with selective logging
export class AuditStorageManager {
  private static readonly STORAGE_KEY = 'consent_audit_trail';
  private static readonly MAX_ENTRIES = 50; // Reduced from 100
  private static readonly CLEANUP_THRESHOLD = 25; // Reduced from 50

  // Define critical events that must be logged (cost-effective)
  private static readonly CRITICAL_EVENTS = new Set([
    'access_granted',
    'access_denied', 
    'document_printed',
    'transaction_completed',
    'security_violation',
    'print_attempt_blocked',
    'suspicious_activity'
  ]);

  // Define optional events (can be skipped to save costs)
  private static readonly OPTIONAL_EVENTS = new Set([
    'document_viewed',
    'cafe_selected',
    'page_focus_lost',
    'window_blur',
    'devtools_opened',
    'document_viewer_opened',
    'document_viewer_closed'
  ]);

  /**
   * Add an audit entry with selective logging based on importance
   */
  static addEntry(entry: any, force: boolean = false): boolean {
    try {
      // Skip optional events unless forced
      if (!force && this.OPTIONAL_EVENTS.has(entry.action)) {
        console.log(`⏭️ Skipping optional audit event: ${entry.action}`);
        return true; // Return true to not break the flow
      }

      // Always log critical events
      if (!this.CRITICAL_EVENTS.has(entry.action) && !force) {
        console.log(`⏭️ Skipping non-critical audit event: ${entry.action}`);
        return true;
      }

      let existingAudit = this.getEntries();
      
      // More aggressive cleanup for cost optimization
      if (existingAudit.length >= this.MAX_ENTRIES) {
        existingAudit = existingAudit.slice(-this.CLEANUP_THRESHOLD);
        console.log(`🧹 Cleaned up audit trail - keeping last ${this.CLEANUP_THRESHOLD} entries`);
      }
      
      const auditEntry = {
        ...entry,
        id: entry.id || Math.random().toString(36).substr(2, 9),
        timestamp: entry.timestamp || new Date(),
        priority: this.CRITICAL_EVENTS.has(entry.action) ? 'critical' : 'normal'
      };
      
      existingAudit.push(auditEntry);
      
      // Try to store
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingAudit));
        console.log(`📝 Logged ${auditEntry.priority} audit event: ${entry.action}`);
        return true;
      } catch (storageError) {
        if (storageError instanceof DOMException && storageError.code === 22) {
          // Quota exceeded, emergency cleanup
          console.warn('⚠️ localStorage quota exceeded, emergency cleanup');
          existingAudit = existingAudit
            .filter(e => this.CRITICAL_EVENTS.has(e.action)) // Keep only critical events
            .slice(-10); // Keep only last 10 critical events
          existingAudit.push(auditEntry);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingAudit));
          return true;
        }
        throw storageError;
      }
    } catch (error) {
      console.error('❌ Failed to store audit entry:', error);
      return false;
    }
  }

  /**
   * Add only critical audit events (cost-optimized)
   */
  static addCriticalEvent(action: string, details: any): boolean {
    return this.addEntry({
      action,
      ...details,
      priority: 'critical'
    }, true);
  }

  /**
   * Check if an event is critical
   */
  static isCriticalEvent(action: string): boolean {
    return this.CRITICAL_EVENTS.has(action);
  }

  /**
   * Get statistics about audit events
   */
  static getEventStats(): { critical: number; optional: number; total: number } {
    try {
      const entries = this.getEntries();
      const critical = entries.filter(e => this.CRITICAL_EVENTS.has(e.action)).length;
      const optional = entries.filter(e => this.OPTIONAL_EVENTS.has(e.action)).length;
      return { critical, optional, total: entries.length };
    } catch (error) {
      return { critical: 0, optional: 0, total: 0 };
    }
  }

  /**
   * Get all audit entries
   */
  static getEntries(): any[] {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch (error) {
      console.error('❌ Failed to parse audit entries:', error);
      return [];
    }
  }

  /**
   * Clear all audit entries
   */
  static clearEntries(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('❌ Failed to clear audit entries:', error);
      return false;
    }
  }

  /**
   * Get storage usage info
   */
  static getStorageInfo(): { entries: number; sizeKB: number } {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY) || '[]';
      return {
        entries: JSON.parse(data).length,
        sizeKB: Math.round(new Blob([data]).size / 1024)
      };
    } catch (error) {
      return { entries: 0, sizeKB: 0 };
    }
  }

  /**
   * Check if storage is approaching quota
   */
  static isNearQuota(): boolean {
    try {
      const testKey = 'quota_test';
      const testData = 'x'.repeat(1024); // 1KB test
      localStorage.setItem(testKey, testData);
      localStorage.removeItem(testKey);
      return false; // Storage OK
    } catch (error) {
      return true; // Near quota
    }
  }

  /**
   * Cleanup old entries based on age (improved efficiency)
   */
  static cleanupOldEntries(maxAgeHours: number = 24): number {
    try {
      const entries = this.getEntries();
      const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
      
      // Prioritize keeping critical events even if they're older
      const criticalEntries = entries.filter(entry => {
        return this.CRITICAL_EVENTS.has(entry.action);
      });
      
      const recentEntries = entries.filter(entry => {
        const entryTime = new Date(entry.timestamp);
        return entryTime > cutoffTime;
      });
      
      // Merge critical + recent entries (remove duplicates)
      const entryIds = new Set();
      const filteredEntries = [...criticalEntries, ...recentEntries]
        .filter(entry => {
          if (entryIds.has(entry.id)) return false;
          entryIds.add(entry.id);
          return true;
        })
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      const removedCount = entries.length - filteredEntries.length;
      if (removedCount > 0) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEntries));
        console.log(`🧹 Removed ${removedCount} old audit entries (kept ${criticalEntries.length} critical events)`);
      }
      
      return removedCount;
    } catch (error) {
      console.error('❌ Failed to cleanup old entries:', error);
      return 0;
    }
  }
}

// Export the storage manager
export default AuditStorageManager;