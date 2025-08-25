import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ConversationFlowProps {
  onStartDocumentSelection: () => void;
  onUploadDocuments: () => void;
}

const ConversationFlow: React.FC<ConversationFlowProps> = ({ onStartDocumentSelection, onUploadDocuments }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showStartButton, setShowStartButton] = useState(false);

  const conversation = [
    {
      speaker: 'user',
      text: 'I need to print some documents',
      translation: 'User requests document printing service',
      avatar: 'USER'
    },
    {
      speaker: 'cafe',
      text: 'Which documents do you need printed?',
      translation: 'Café operator asks for document details',
      avatar: 'CAFE'
    },
    {
      speaker: 'user',
      text: 'I have all documents on my phone. You can request access',
      translation: 'User offers to share documents digitally',
      avatar: 'USER'
    },
    {
      speaker: 'cafe',
      text: 'Please choose and share the documents from your phone',
      translation: 'Café operator guides user through the process',
      avatar: 'CAFE'
    }
  ];

  useEffect(() => {
    if (currentStep < conversation.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // Show start button after conversation ends
      setTimeout(() => setShowStartButton(true), 1000);
    }
  }, [currentStep, conversation.length]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Document Sharing Process
        </h3>
        <p className="text-sm text-gray-600">
          How document sharing actually works
        </p>
      </div>

      <div className="space-y-4 max-h-64 overflow-y-auto">
        {conversation.slice(0, currentStep).map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: message.speaker === 'user' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`flex ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-xs ${
              message.speaker === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                {message.avatar}
              </div>
              <div className={`p-3 rounded-lg ${
                message.speaker === 'user' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm font-medium">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.speaker === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.translation}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {showStartButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-6"
        >
          <div className="inline-flex items-center bg-green-50 px-4 py-2 rounded-full mb-4">
            <span className="text-green-800 text-sm font-medium">
              Now you're in control!
            </span>
          </div>
          <div className="space-y-3">
            <button
              onClick={onStartDocumentSelection}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              Choose Documents to Share
            </button>
            <button
              onClick={onUploadDocuments}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105"
            >
              Upload New Documents
            </button>
          </div>
        </motion.div>
      )}

      {currentStep < conversation.length && (
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            {conversation.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index < currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ConversationFlow;