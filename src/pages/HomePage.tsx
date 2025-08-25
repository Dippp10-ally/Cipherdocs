import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import WhatIsConsentChain from '../components/WhatIsConsentChain';
import HowItWorks from '../components/HowItWorks';
import UseCases from '../components/UseCases';
import Vision from '../components/Vision';
import PremiumShowcase from '../components/PremiumShowcase';

type TabType = 'overview' | 'share' | 'receive' | 'features';

interface UserTypeCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  features: string[];
}

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const userTypes: UserTypeCard[] = [
    {
      title: 'Share Documents',
      description: 'Send documents securely via ID, QR, email, or phone',
      icon: '📤',
      route: '/share',
      color: 'from-blue-500 to-blue-600',
      features: [
        'Multiple sharing methods',
        'Time-limited access',
        'Full audit trail',
        'Secure encryption'
      ]
    },
    {
      title: 'Receive Documents',
      description: 'Access shared documents with verification',
      icon: '📥',
      route: '/receiver',
      color: 'from-green-500 to-green-600',
      features: [
        'Secure document access',
        'View & print documents',
        'Identity verification',
        'Time-limited sessions'
      ]
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'share', label: 'Share Documents', icon: '📤' },
    { id: 'receive', label: 'Receive Documents', icon: '📥' },
    { id: 'features', label: 'Features', icon: '⚡' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            <Hero />
            <WhatIsConsentChain />
            
            {/* User Type Selection */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Choose Your Role
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Select how you want to use CipherDocs for secure document management
                  </p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {userTypes.map((userType, index) => (
                    <motion.div
                      key={userType.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="group"
                    >
                      <Link to={userType.route}>
                        <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 h-full">
                          <div className={`w-16 h-16 bg-gradient-to-r ${userType.color} rounded-xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform`}>
                            {userType.icon}
                          </div>
                          
                          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                            {userType.title}
                          </h3>
                          
                          <p className="text-gray-600 mb-6 text-center">
                            {userType.description}
                          </p>
                          
                          <div className="space-y-3">
                            {userType.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center text-sm text-gray-700">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                {feature}
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-8 text-center">
                            <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${userType.color} text-white rounded-lg font-semibold group-hover:shadow-lg transition-all`}>
                              Get Started
                              <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        );
        
      case 'share':
        return (
          <motion.div
            key="share"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-16"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-6xl mx-auto mb-8">
                📤
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Share Documents Your Way
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                Choose from multiple sharing methods: User ID, QR code, email, or phone number. 
                All with secure encryption and time-limited access.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                    🎯
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Multiple Methods</h3>
                  <p className="text-gray-600">Share via User ID, QR scan, email, or phone - whatever works best for you.</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                    ⚡
                  </div>
                  <h3 className="text-2xl font-bold mb-4">One Simple Flow</h3>
                  <p className="text-gray-600">No more confusing multiple pages - everything in one streamlined interface.</p>
                </div>
              </div>
              
              <Link
                to="/share"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Start Sharing Documents
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        );
        
      case 'receive':
        return (
          <motion.div
            key="receive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-16"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center text-6xl mx-auto mb-8">
                📥
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Receive Documents Safely
              </h1>
              
              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
                Access shared documents through secure channels with complete verification and audit capabilities.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                    🔍
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Verify Access</h3>
                  <p className="text-gray-600">Complete verification process with PIN-based authentication.</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-4">
                    📋
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Audit Trail</h3>
                  <p className="text-gray-600">Every access is logged with timestamps and activity details.</p>
                </div>
              </div>
              
              <Link
                to="/receiver"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Access Documents
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>
        );
        
      case 'features':
        return (
          <motion.div
            key="features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-16"
          >
            <HowItWorks />
            <UseCases />
            <Vision />
            <PremiumShowcase />
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-purple-50">
      {/* Modern Tab Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="pt-8">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default HomePage; 