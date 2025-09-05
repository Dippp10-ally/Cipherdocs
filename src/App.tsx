import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext.js';
import { ProfileProvider } from './context/ProfileContext';
import AuditStorageManager from './utils/auditStorageManager';
import './utils/storageReset'; // Initialize emergency reset utility

// Pages
import Documents from './components/Documents';
import ConsentsPage from './pages/ConsentsPage';
import TelegramBotPage from './pages/TelegramBotPage';
import HomePage from './pages/HomePage'; // Modern tabbed homepage
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutUsPage from './pages/AboutUsPage';
import UnifiedSharingPage from './pages/UnifiedSharingPage'; // Unified document sharing interface
import ReceiverPage from './pages/ReceiverPage'; // Modern receiver interface
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import SecurityPage from './pages/SecurityPage';

// Components
import Layout from './components/Layout';

const App: React.FC = () => {
  // Cleanup old audit entries on app startup
  React.useEffect(() => {
    const cleanupOldEntries = () => {
      try {
        const removedCount = AuditStorageManager.cleanupOldEntries(24); // Remove entries older than 24 hours
        if (removedCount > 0) {
          console.log(`🧹 App startup: Cleaned up ${removedCount} old audit entries`);
        }
        
        // Check storage status
        const storageInfo = AuditStorageManager.getStorageInfo();
        console.log(`Audit storage: ${storageInfo.entries} entries, ${storageInfo.sizeKB}KB`);
        
        if (AuditStorageManager.isNearQuota()) {
          console.warn('localStorage approaching quota limit');
        }
      } catch (error) {
        console.error('❌ Failed to cleanup audit storage:', error);
      }
    };
    
    cleanupOldEntries();
  }, []);

  return (
    <WalletProvider>
      <ProfileProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/share" element={<UnifiedSharingPage />} />
              <Route path="/receiver" element={<ReceiverPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/consents" element={<ConsentsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/telegram-bot" element={<TelegramBotPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsOfServicePage />} />
              <Route path="/security" element={<SecurityPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </Router>
      </ProfileProvider>
    </WalletProvider>
  );
};

export default App;
