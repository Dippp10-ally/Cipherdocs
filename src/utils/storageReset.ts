// Emergency localStorage reset utility
export const resetAuditStorage = () => {
  try {
    // Clear audit trail
    localStorage.removeItem('consent_audit_trail');
    
    // Clear other CipherDoc related storage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('consent') || key.includes('audit') || key.includes('document'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log(`🧹 Emergency storage reset: Cleared ${keysToRemove.length} keys`);
    
    // Add a reset marker
    localStorage.setItem('storage_reset_timestamp', new Date().toISOString());
    
    return true;
  } catch (error) {
    console.error('❌ Failed to reset storage:', error);
    return false;
  }
};

// Expose reset function globally for emergency use
if (typeof window !== 'undefined') {
  (window as any).resetCipherDocStorage = resetAuditStorage;
  console.log('🛠️ Emergency storage reset available: call resetCipherDocStorage() in console');
}