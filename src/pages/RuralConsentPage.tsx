import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import UPIStyleConsent from '../components/UPIStyleConsent';
import UPIPinSetup from '../components/UPIPinSetup';
import DocumentSelector from '../components/DocumentSelector';
import DocumentUpload from '../components/DocumentUpload';
import CafeAccessInterface from '../components/CafeAccessInterface';
import AuditTrail from '../components/AuditTrail';
import CafeDiscovery from '../components/CafeDiscovery';
// @ts-ignore - Temporary fix for module resolution
import SecurePrintInterface from '../components/SecurePrintInterface';
import AuditStorageManager from '../utils/auditStorageManager';
import SafeStorage from '../utils/safeStorage';
import { smsService } from '../services/upiStyleSMSService';

interface Document {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  sensitive: boolean;
}

interface UserSession {
  phoneNumber: string;
  pinSet: boolean;
  name: string;
}

interface Cafe {
  id: string;
  name: string;
  location: string;
  email: string;
  code: string;
  qrCode: string;
  verified: boolean;
  rating: number;
  distance?: string;
  operator: string;
  status: 'online' | 'offline' | 'busy';
}

const RuralConsentPage: React.FC = () => {
  const location = useLocation();
  const [user, setUser] = useState<UserSession | null>(null);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [showCafeDiscovery, setShowCafeDiscovery] = useState(false);
  const [showConsentRequest, setShowConsentRequest] = useState(false);
  const [showDocumentSelector, setShowDocumentSelector] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [showCafeAccess, setShowCafeAccess] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showSecurePrint, setShowSecurePrint] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [accessDuration, setAccessDuration] = useState(15);
  const [accessCode, setAccessCode] = useState('');

  // Check if this is receiver mode based on URL parameters
  const searchParams = new URLSearchParams(location.search);
  const accessMethod = searchParams.get('method'); // 'pin', 'qr', 'link', or null
  const isReceiverMode = accessMethod === 'pin' || accessMethod === 'qr' || accessMethod === 'link';

  const requesterName = selectedCafe ? selectedCafe.name : 'Select a Café';

  useEffect(() => {
    // Cleanup storage on component mount to prevent quota issues
    const performInitialCleanup = () => {
      try {
        // Clean up old audit entries
        const removedAuditCount = AuditStorageManager.cleanupOldEntries(24);
        if (removedAuditCount > 0) {
          console.log(`🧹 Initial cleanup: Removed ${removedAuditCount} old audit entries`);
        }
        
        // Check storage status
        const storageInfo = AuditStorageManager.getStorageInfo();
        console.log(`📊 Storage status: ${storageInfo.entries} entries, ${storageInfo.sizeKB}KB`);
        
        if (AuditStorageManager.isNearQuota()) {
          console.warn('⚠️ localStorage approaching quota limit - additional cleanup may be needed');
          
          // More aggressive cleanup if near quota
          AuditStorageManager.cleanupOldEntries(6); // Keep only last 6 hours
        }
      } catch (error) {
        console.error('❌ Failed to perform initial storage cleanup:', error);
      }
    };
    
    // Perform cleanup
    performInitialCleanup();
    
    // Check if user exists in localStorage
    const storedUser = SafeStorage.getItem('rural_user');
    if (storedUser) {
      setUser(storedUser);
    }
    
    // Check if café was previously selected
    const storedCafe = SafeStorage.getItem('selected_cafe');
    if (storedCafe) {
      setSelectedCafe(storedCafe);
    }
  }, []);

  useEffect(() => {
    if (accessGranted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      
      if (timeRemaining === 1) {
        setAccessGranted(false);
        // Send expiry SMS
        if (user) {
          smsService.sendAccessExpiry(
            user.phoneNumber,
            selectedDocuments.map(d => d.name).join(', '),
            requesterName
          );
        }
      }
      
      return () => clearTimeout(timer);
    }
  }, [accessGranted, timeRemaining, user, selectedDocuments, requesterName]);

  const handlePinSetup = async (pin: string, phoneNumber: string) => {
    const userData: UserSession = {
      phoneNumber,
      pinSet: true,
      name: 'User' // In real app, get from form
    };
    
    SafeStorage.setItem('rural_user', userData);
    SafeStorage.setItem('user_pin', pin); // In production, hash this!
    setUser(userData);
    setShowPinSetup(false);
    
    // Send confirmation SMS
    await smsService.sendPinSetupConfirmation(phoneNumber);
  };

  const handleConsentResponse = async (approved: boolean) => {
    setShowConsentRequest(false);
    
    if (approved && user) {
      setAccessGranted(true);
      setTimeRemaining(accessDuration * 60); // Convert to seconds
      
      // Generate access code
      const generatedAccessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setAccessCode(generatedAccessCode);
      
      // Log initial audit entry (CRITICAL EVENT)
      const auditEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        action: 'access_granted',
        documentName: selectedDocuments.map(d => d.name).join(', '),
        requesterName,
        userPhone: user.phoneNumber,
        ipAddress: '192.168.1.100', // Would be detected in production
        deviceInfo: navigator.userAgent.split(' ')[0],
        accessCode: generatedAccessCode,
        duration: accessDuration,
        details: `Access granted for ${selectedDocuments.length} document(s) for ${accessDuration} minutes`
      };
      
      // Store only critical audit events to save costs
      AuditStorageManager.addCriticalEvent('access_granted', {
        documentName: selectedDocuments.map(d => d.name).join(', '),
        requesterName,
        userPhone: user.phoneNumber,
        ipAddress: '192.168.1.100',
        deviceInfo: navigator.userAgent.split(' ')[0],
        accessCode: generatedAccessCode,
        duration: accessDuration,
        details: `Access granted for ${selectedDocuments.length} document(s) for ${accessDuration} minutes`
      });
      
      // Send approval SMS
      await smsService.sendConsentApproval(user.phoneNumber, {
        documentName: selectedDocuments.map(d => d.name).join(', '),
        requesterName,
        duration: accessDuration,
        accessCode: generatedAccessCode
      });
      
      // Show café access interface
      setShowCafeAccess(true);
    } else {
      // Log denial
      if (user) {
        // Log denial (CRITICAL EVENT)
        AuditStorageManager.addCriticalEvent('access_denied', {
          documentName: selectedDocuments.map(d => d.name).join(', '),
          requesterName,
          userPhone: user.phoneNumber,
          ipAddress: '192.168.1.100',
          deviceInfo: navigator.userAgent.split(' ')[0],
          details: 'User denied access to documents'
        });
      }
    }
  };

  const handleDocumentsSelected = (documents: Document[], duration: number) => {
    setSelectedDocuments(documents);
    setAccessDuration(duration);
    setShowDocumentSelector(false);
    setShowConsentRequest(true);
    
    // Send SMS notification
    if (user) {
      smsService.sendConsentRequest(user.phoneNumber, {
        documentName: documents.map(d => d.name).join(', '),
        requesterName,
        duration,
        accessCode: '' // Will be generated after approval
      });
    }
  };

  const handleDocumentsUploaded = (documents: Document[]) => {
    setShowDocumentUpload(false);
    // Go directly to main screen after upload
  };

  const handleCafeSelected = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    
    // Use SafeStorage to handle quota issues automatically
    const saved = SafeStorage.setItem('selected_cafe', cafe);
    if (saved) {
      console.log(`✅ Café selected: ${cafe.name} (${cafe.location})`);
      // Only log cafe selection if it's the first time or a change
      // This is not a critical event, so we skip it to save costs
    } else {
      console.warn('⚠️ Failed to save café selection to storage');
    }
    
    setShowCafeDiscovery(false);
  };

  const startConsentRequest = async () => {
    // First check if café is selected
    if (!selectedCafe) {
      setShowCafeDiscovery(true);
      return;
    }
    
    if (!user?.pinSet) {
      setShowPinSetup(true);
      return;
    }
    
    // Check if user has uploaded documents
    const storedDocs = SafeStorage.getItem('user_documents', []);
    if (!storedDocs || storedDocs.length === 0) {
      setShowDocumentUpload(true);
      return;
    }
    
    setShowDocumentSelector(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showDocumentUpload) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Upload Your Documents
            </h1>
            <p className="text-gray-600">First, securely upload your documents to IPFS</p>
          </div>
          
          <DocumentUpload
            onDocumentsUploaded={handleDocumentsUploaded}
            onBack={() => {
              setShowDocumentUpload(false);
            }}
          />
        </div>
      </div>
    );
  }

  if (showPinSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              CipherDocs Setup
            </h1>
            <p className="text-gray-600">Secure PIN-based Authentication</p>
          </div>
          
          <UPIPinSetup onPinSetup={handlePinSetup} />
        </div>
      </div>
    );
  }

  if (showCafeAccess && accessGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Café Access Portal
            </h1>
            <p className="text-gray-600">Documents are now accessible to the café</p>
          </div>
          
          <CafeAccessInterface
            sharedDocuments={selectedDocuments.map(doc => ({
              ...doc,
              expiresAt: new Date(Date.now() + timeRemaining * 1000)
            }))}
            accessCode={accessCode}
            timeRemaining={timeRemaining}
            cafeName={selectedCafe?.name}
            onView={(docId) => {
              console.log('Document viewed:', docId);
            }}
            onShowAudit={() => setShowAuditTrail(true)}
            onTransactionComplete={() => {
              // Log critical transaction completion event
              AuditStorageManager.addCriticalEvent('transaction_completed', {
                documentCount: selectedDocuments.length,
                cafeName: selectedCafe?.name,
                accessCode,
                userPhone: user?.phoneNumber,
                details: 'Transaction completed successfully, all files removed from access'
              });
              
              // Reset all state when transaction is completed
              setShowCafeAccess(false);
              setAccessGranted(false);
              setSelectedDocuments([]);
              setTimeRemaining(0);
              setAccessCode('');
              
              // Clear localStorage using SafeStorage
              SafeStorage.removeItem('shared_documents');
              SafeStorage.removeItem('access_granted');
              SafeStorage.removeItem('access_code');
              
              // Show success message
              alert('Transaction completed successfully!\nAll files have been removed from access\nSession securely closed');
            }}
          />
          
          <div className="text-center mt-6">
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setShowSecurePrint(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                                Secure Print (IPFS)
              </button>
              <button
                onClick={() => setShowAuditTrail(true)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                View Audit Trail
              </button>
              <button
                onClick={() => {
                  setShowCafeAccess(false);
                  setAccessGranted(false);
                  setSelectedDocuments([]);
                  setTimeRemaining(0);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Back to User View
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showDocumentSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <DocumentSelector
            onDocumentsSelected={handleDocumentsSelected}
            onCancel={() => setShowDocumentSelector(false)}
            requesterName={requesterName}
          />
        </div>
      </div>
    );
  }

  if (showConsentRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <UPIStyleConsent
            onConsent={handleConsentResponse}
            documents={selectedDocuments}
            requesterName={requesterName}
            duration={accessDuration}
            phoneNumber={user?.phoneNumber}
          />
        </div>
      </div>
    );
  }

  // Receiver Mode Interface
  if (isReceiverMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
              {accessMethod === 'qr' ? '📱' : accessMethod === 'link' ? '🔗' : '📲'}
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {accessMethod === 'qr' ? 'QR Code Scanner' : 
               accessMethod === 'link' ? 'Direct Link Access' : 
               'PIN-Based Access'}
            </h1>
            <p className="text-gray-600">
              {accessMethod === 'qr' 
                ? 'Scan the QR code shared by the sender to access documents'
                : accessMethod === 'link'
                ? 'Click the link shared by the sender to access documents'
                : 'Enter the PIN shared by the sender to access documents'}
            </p>
          </div>

          {/* Different interfaces for different access methods */}
          {accessMethod === 'qr' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📱 QR Code Scanner
              </h2>
              
              <div className="text-center mb-6">
                <div className="w-48 h-48 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📷</div>
                    <p>Camera will open here</p>
                    <p className="text-sm">for QR code scanning</p>
                  </div>
                </div>
                
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
                  📱 Open Camera Scanner
                </button>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📋 How it works:</h3>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Ask the sender to show you their QR code</li>
                  <li>2. Click 'Open Camera Scanner' above</li>
                  <li>3. Point camera at the QR code</li>
                  <li>4. Documents will open automatically</li>
                </ol>
              </div>
            </motion.div>
          )}

          {accessMethod === 'link' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🔗 Direct Link Access
              </h2>
              
              <div className="text-center mb-6">
                <div className="bg-green-50 rounded-lg p-6 mb-4">
                  <div className="text-4xl mb-3">✅</div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Link Access Ready!</h3>
                  <p className="text-green-700">This link contains all access information</p>
                </div>
                
                <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg">
                  🔓 Access Documents Now
                </button>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">🔐 Security Features:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Time-limited access (expires automatically)</li>
                  <li>• Encrypted document viewing only</li>
                  <li>• Complete audit trail maintained</li>
                  <li>• No downloads - secure viewing only</li>
                </ul>
              </div>
            </motion.div>
          )}

          {accessMethod === 'pin' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                📲 PIN-Based Access
              </h2>
              
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🔢 Enter 6-Digit Access PIN
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Ask the sender for the 6-digit PIN they generated
                  </p>
                  <input
                    type="text"
                    placeholder="● ● ● ● ● ●"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest"
                    maxLength={6}
                  />
                </div>
                
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg">
                  🔓 Access Documents
                </button>
              </div>
              
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">📝 Instructions:</h3>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Get the 6-digit PIN from the document sender</li>
                  <li>2. Enter the PIN in the field above</li>
                  <li>3. Click 'Access Documents' to view files</li>
                  <li>4. Access expires automatically after time limit</li>
                </ol>
              </div>
            </motion.div>
          )}
          
          {/* Help Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
              💡 Need Help?
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 text-xl font-bold mx-auto mb-3">
                  ❌
                </div>
                <h4 className="font-semibold mb-2">Can't access documents?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  • Check if the sender shared the correct {accessMethod === 'qr' ? 'QR code' : accessMethod === 'link' ? 'link' : 'PIN'}<br/>
                  • Verify the access hasn't expired<br/>
                  • Contact the sender for a new share
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl font-bold mx-auto mb-3">
                  📤
                </div>
                <h4 className="font-semibold mb-2">Want to share documents?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Switch to sender mode to upload and share your own documents.
                </p>
                <Link 
                  to="/sender"
                  className="text-green-600 hover:text-green-800 font-medium text-sm"
                >
                  Go to Sender →
                </Link>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Link 
                to="/"
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            CipherDocs
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Secure Document Sharing Platform
          </p>
          <div className="inline-flex items-center bg-green-100 px-4 py-2 rounded-full">
            <span className="text-green-800 font-semibold">
              Professional Document Management
            </span>
          </div>
        </div>

        {/* User Status */}
        {user ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold text-lg">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-600">+91-****-**{user.phoneNumber.slice(-2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600 font-medium">PIN Set</span>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Current Status */}
        {accessGranted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-8 mb-8 text-center"
          >
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Access Granted</h2>
            <p className="text-lg mb-4">Your documents are available for sharing</p>
            <div className="text-sm mb-2">
              {selectedDocuments.map((doc, index) => (
                <span key={doc.id} className="inline-flex items-center">
                  {doc.icon} {doc.name}
                  {index < selectedDocuments.length - 1 && ', '}
                </span>
              ))}
            </div>
            <div className="text-3xl font-mono font-bold mb-2">{formatTime(timeRemaining)}</div>
            <p className="text-sm opacity-90">Access expires automatically</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              {/* Selected Café Display */}
              {selectedCafe ? (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-6">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedCafe.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800">{selectedCafe.name}</h3>
                      <p className="text-sm text-green-600">{selectedCafe.location}</p>
                    </div>
                    {selectedCafe.verified && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Verified
                      </span>
                    )}
                    <button
                      onClick={() => setShowCafeDiscovery(true)}
                      className="text-green-600 hover:text-green-800 text-sm underline"
                    >
                      Change Café
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-yellow-800 font-medium">Please select an internet café first</p>
                    <button
                      onClick={() => setShowCafeDiscovery(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm font-medium"
                    >
                      Select Café
                    </button>
                  </div>
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ready for Secure Document Sharing
              </h2>
              <p className="text-gray-600 mb-6">
                Choose which documents to share with the café for printing or processing.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={startConsentRequest}
                  disabled={!selectedCafe || selectedCafe.status !== 'online'}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 disabled:transform-none"
                >
                  {!selectedCafe ? 'Select Café First' : 
                   selectedCafe.status !== 'online' ? 'Café Offline' :
                   'Choose Documents to Share'}
                </button>
                <button
                  onClick={() => setShowDocumentUpload(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
                >
                  Upload New Documents
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* How it Works */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 text-center shadow-md"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold text-xl">1</span>
            </div>
            <h3 className="font-semibold mb-2">Café Requests</h3>
            <p className="text-sm text-gray-600">Café asks for document sharing access</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 text-center shadow-md"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold text-xl">2</span>
            </div>
            <h3 className="font-semibold mb-2">You Choose</h3>
            <p className="text-sm text-gray-600">Select which documents to share</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 text-center shadow-md"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 font-bold text-xl">3</span>
            </div>
            <h3 className="font-semibold mb-2">PIN Approval</h3>
            <p className="text-sm text-gray-600">Enter 4-digit PIN (like UPI)</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 text-center shadow-md"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-orange-600 font-bold text-xl">4</span>
            </div>
            <h3 className="font-semibold mb-2">Auto-Expire</h3>
            <p className="text-sm text-gray-600">Access ends automatically</p>
          </motion.div>
        </div>

        {/* Benefits */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Key Benefits
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span><strong>You choose</strong> which documents to share</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Automatic access expiry</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Works with any smartphone</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Simple and secure process</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Complete audit trail on blockchain</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                <span>Enterprise-grade security</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
      
      {/* Café Discovery Modal */}
      {showCafeDiscovery && (
        <CafeDiscovery
          onCafeSelected={handleCafeSelected}
          onClose={() => setShowCafeDiscovery(false)}
        />
      )}

      {/* Audit Trail Modal */}
      {showAuditTrail && (
        <AuditTrail onClose={() => setShowAuditTrail(false)} />
      )}

      {/* Secure Print Interface */}
      {showSecurePrint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Secure IPFS Printing
                </h2>
                <button
                  onClick={() => setShowSecurePrint(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <SecurePrintInterface
                documents={selectedDocuments.map(doc => ({
                  id: doc.id,
                  name: doc.name,
                  printable: !doc.sensitive, // Non-sensitive docs are printable
                  sensitive: doc.sensitive || false,
                }))}
                shopId={selectedCafe?.id || 'unknown'}
                userId={user?.phoneNumber || 'anonymous'}
                onPrintComplete={(results: any) => {
                  console.log('Print results:', results);
                  // Log completion of secure print process
                  AuditStorageManager.addCriticalEvent('secure_print_session_completed', {
                    resultsCount: results.length,
                    shopId: selectedCafe?.id,
                    userId: user?.phoneNumber
                  });
                }}
                onClose={() => setShowSecurePrint(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RuralConsentPage;