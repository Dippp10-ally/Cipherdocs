import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface UPIPinSetupProps {
  onPinSetup: (pin: string, phoneNumber: string) => void;
  existingPhoneNumber?: string;
}

const UPIPinSetup: React.FC<UPIPinSetupProps> = ({ onPinSetup, existingPhoneNumber }) => {
  const [step, setStep] = useState<'phone' | 'otp' | 'pin' | 'confirm'>('phone');
  const [phoneNumber, setPhoneNumber] = useState(existingPhoneNumber || '');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async () => {
    if (phoneNumber.length !== 10) return;
    setIsLoading(true);
    
    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 1500);
  };

  const handleOtpSubmit = async () => {
    if (otp.length !== 6) return;
    setIsLoading(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);
      if (otp === '123456') { // Demo OTP
        setStep('pin');
      } else {
        alert('Invalid OTP. Please try 123456 for demo');
      }
    }, 1000);
  };

  const handlePinSubmit = () => {
    if (pin.length !== 4) return;
    setStep('confirm');
  };

  const handleConfirmPin = () => {
    if (pin !== confirmPin) {
      alert('PINs do not match');
      setConfirmPin('');
      return;
    }
    onPinSetup(pin, phoneNumber);
  };

  if (step === 'phone') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg border"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">मोबाइल नंबर दर्ज करें</h3>
          <p className="text-gray-600">Enter Mobile Number</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                +91
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 px-3 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                placeholder="Enter 10-digit number"
                maxLength={10}
              />
            </div>
          </div>

          <button
            onClick={handlePhoneSubmit}
            disabled={phoneNumber.length !== 10 || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              phoneNumber.length === 10 && !isLoading
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </div>
      </motion.div>
    );
  }

  if (step === 'otp') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg border"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">OTP दर्ज करें</h3>
          <p className="text-gray-600">Enter 6-digit OTP sent to +91-{phoneNumber}</p>
          <p className="text-sm text-blue-600 mt-2">Demo OTP: 123456</p>
        </div>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
            />
          </div>

          <button
            onClick={handleOtpSubmit}
            disabled={otp.length !== 6 || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              otp.length === 6 && !isLoading
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            onClick={() => setStep('phone')}
            className="w-full py-2 text-gray-600 hover:text-gray-800"
          >
            Change Number
          </button>
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
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">सुरक्षा पिन बनाएं</h3>
          <p className="text-gray-600">Create 4-digit Security PIN</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center space-x-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-semibold ${
                  pin.length > index
                    ? 'border-purple-500 bg-purple-50 text-purple-600'
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
                  ? 'bg-purple-500 hover:bg-purple-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              →
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
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">पिन की पुष्टि करें</h3>
        <p className="text-gray-600">Confirm your PIN</p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center space-x-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-semibold ${
                confirmPin.length > index
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-300'
              }`}
            >
              {confirmPin.length > index ? '•' : ''}
            </div>
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => {
                if (confirmPin.length < 4) {
                  setConfirmPin(confirmPin + num.toString());
                }
              }}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-semibold transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => setConfirmPin(confirmPin.slice(0, -1))}
            className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-colors"
          >
            ⌫
          </button>
          <button
            onClick={() => {
              if (confirmPin.length < 4) {
                setConfirmPin(confirmPin + '0');
              }
            }}
            className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg text-xl font-semibold transition-colors"
          >
            0
          </button>
          <button
            onClick={handleConfirmPin}
            disabled={confirmPin.length !== 4}
            className={`w-16 h-16 rounded-lg text-sm font-semibold transition-colors ${
              confirmPin.length === 4
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
};

export default UPIPinSetup;