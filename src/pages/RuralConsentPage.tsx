import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UPIStyleConsent from '../components/UPIStyleConsent';
import UPIPinSetup from '../components/UPIPinSetup';
import { smsService } from '../services/upiStyleSMSService';

interface UserSession {
  phoneNumber: string;
  pinSet: boolean;
  name: string;
}

const RuralConsentPage: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [showConsentRequest, setShowConsentRequest] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Mock document request
  const mockRequest = {
    documentName: 'Aadhaar Card',
    requesterName: 'Cyber Café - Delhi',
    duration: 15, // 15 minutes
    phoneNumber: user?.phoneNumber || ''
  };

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('rural_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
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
            mockRequest.documentName,
            mockRequest.requesterName
          );
        }
      }
      
      return () => clearTimeout(timer);
    }
  }, [accessGranted, timeRemaining, user, mockRequest]);

  const handlePinSetup = async (pin: string, phoneNumber: string) => {
    const userData: UserSession = {
      phoneNumber,
      pinSet: true,
      name: 'User' // In real app, get from form
    };
    
    localStorage.setItem('rural_user', JSON.stringify(userData));
    localStorage.setItem('user_pin', pin); // In production, hash this!
    setUser(userData);
    setShowPinSetup(false);
    
    // Send confirmation SMS
    await smsService.sendPinSetupConfirmation(phoneNumber);
  };

  const handleConsentResponse = async (approved: boolean) => {
    setShowConsentRequest(false);
    
    if (approved && user) {
      setAccessGranted(true);
      setTimeRemaining(mockRequest.duration * 60); // Convert to seconds
      
      // Generate access code
      const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Send approval SMS
      await smsService.sendConsentApproval(user.phoneNumber, {
        ...mockRequest,
        accessCode
      });
    }
  };

  const startConsentRequest = async () => {
    if (!user?.pinSet) {
      setShowPinSetup(true);
      return;
    }
    
    // Send SMS notification
    await smsService.sendConsentRequest(user.phoneNumber, mockRequest);
    setShowConsentRequest(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showPinSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ConsentChain सेटअप / Setup
            </h1>
            <p className="text-gray-600">UPI जैसा आसान / UPI-like Easy Setup</p>
          </div>
          
          <UPIPinSetup onPinSetup={handlePinSetup} />
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
            documentName={mockRequest.documentName}
            requesterName={mockRequest.requesterName}
            duration={mockRequest.duration}
            phoneNumber={user?.phoneNumber}
          />
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
            🏛️ ConsentChain
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            दस्तावेज़ों का सुरक्षित साझाकरण / Secure Document Sharing
          </p>
          <div className="inline-flex items-center bg-green-100 px-4 py-2 rounded-full">
            <span className="text-green-800 font-semibold">
              ✅ UPI जैसा आसान / UPI-like Easy
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
                <span className="text-green-600">✅</span>
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
            <h2 className="text-2xl font-bold mb-2">Access Granted! / अनुमति दी गई!</h2>
            <p className="text-lg mb-4">Your {mockRequest.documentName} is available for printing</p>
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
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ready for Secure Printing
              </h2>
              <p className="text-gray-600 mb-6">
                Café owner will request access to your documents.<br/>
                You'll approve it easily with your PIN (just like UPI!)
              </p>
              
              {/* Demo Button */}
              <button
                onClick={startConsentRequest}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
              >
                🎭 Demo: Café Requests Access
              </button>
            </div>
          </motion.div>
        )}

        {/* How it Works */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 text-center shadow-md"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 font-bold text-xl">1</span>
            </div>
            <h3 className="font-semibold mb-2">QR Scan</h3>
            <p className="text-sm text-gray-600">Café scans your QR code from phone</p>
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
            <h3 className="font-semibold mb-2">PIN Approval</h3>
            <p className="text-sm text-gray-600">You enter 4-digit PIN (like UPI)</p>
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
            <h3 className="font-semibold mb-2">Auto-Expire</h3>
            <p className="text-sm text-gray-600">Access ends automatically after time limit</p>
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
            ✨ Benefits / फायदे
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-green-500">🔒</span>
                <span>Documents never saved on café computer</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-500">⏰</span>
                <span>Automatic access expiry</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-purple-500">📱</span>
                <span>Works with any basic smartphone</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="text-orange-500">🎯</span>
                <span>As easy as UPI payments</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-red-500">📋</span>
                <span>Complete audit trail on blockchain</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-indigo-500">💰</span>
                <span>Free for rural users</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default RuralConsentPage;