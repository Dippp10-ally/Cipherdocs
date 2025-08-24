import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface UPIStyleConsentProps {
  onConsent: (approved: boolean) => void;
  documentName: string;
  requesterName: string;
  duration: number; // in minutes
  phoneNumber?: string;
}

const UPIStyleConsent: React.FC<UPIStyleConsentProps> = ({
  onConsent,
  documentName,
  requesterName,
  duration,
  phoneNumber
}) => {
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'request' | 'pin' | 'success' | 'error'>('request');
  const [countdown, setCountdown] = useState(30); // 30 second timeout

  useEffect(() => {
    if (step === 'pin' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setStep('error');
      onConsent(false);
    }
  }, [countdown, step, onConsent]);

  const handlePinSubmit = async () => {
    if (pin.length !== 4) return;
    
    try {
      // Simulate PIN verification (in real app, this would verify against stored PIN)
      if (pin === '1234') { // Demo PIN
        setStep('success');
        setTimeout(() => onConsent(true), 1500);
      } else {
        setStep('error');
        setTimeout(() => onConsent(false), 1500);
      }
    } catch (error) {
      setStep('error');
      onConsent(false);
    }
  };

  const handleApprove = () => {
    setStep('pin');
  };

  const handleReject = () => {
    onConsent(false);
  };

  if (step === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-green-50 p-6 rounded-2xl border border-green-200"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-green-800 mb-2">मंजूरी दी गई! / Approved!</h3>
          <p className="text-green-600">Access granted for {duration} minutes</p>
        </div>
      </motion.div>
    );
  }

  if (step === 'error') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto bg-red-50 p-6 rounded-2xl border border-red-200"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">गलत पिन / Wrong PIN</h3>
          <p className="text-red-600">Please try again</p>
        </div>
      </motion.div>
    );
  }

  if (step === 'pin') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg border"
      >
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">अपना पिन डालें / Enter Your PIN</h3>
          <p className="text-gray-600">Access expires in: {countdown}s</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-semibold ${
                  pin.length > index
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300'
                }`}
              >
                {pin.length > index ? '•' : ''}
              </div>
            ))}
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => {
                  if (pin.length < 4) {
                    setPin(pin + num.toString());
                  }
                }}
                className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-semibold transition-colors"
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setPin(pin.slice(0, -1))}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors"
            >
              ⌫
            </button>
            <button
              onClick={() => {
                if (pin.length < 4) {
                  setPin(pin + '0');
                }
              }}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-semibold transition-colors"
            >
              0
            </button>
            <button
              onClick={handlePinSubmit}
              disabled={pin.length !== 4}
              className={`w-16 h-16 rounded-lg text-sm font-semibold transition-colors ${
                pin.length === 4
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              ✓
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg border"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">दस्तावेज़ की अनुमति / Document Access</h3>
        {phoneNumber && (
          <p className="text-sm text-gray-500 mb-2">Request sent to: +91-****-**{phoneNumber.slice(-2)}</p>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Document:</span>
            <span className="font-semibold">{documentName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Requester:</span>
            <span className="font-semibold">{requesterName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold text-orange-600">{duration} minutes</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleApprove}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
        >
          मंजूरी दें / Approve
        </button>
        <button
          onClick={handleReject}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
        >
          मना करें / Reject
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        This request will expire in 30 seconds
      </p>
    </motion.div>
  );
};

export default UPIStyleConsent;