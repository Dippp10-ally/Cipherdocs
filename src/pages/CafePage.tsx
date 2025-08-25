import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ServiceFeature {
  icon: string;
  title: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  color: string;
}

const CafePage: React.FC = () => {
  const [activeService, setActiveService] = useState<string>('printing');

  const services: ServiceFeature[] = [
    {
      icon: '🖨️',
      title: 'Secure Document Printing',
      description: 'Print customer documents with full security and audit trails'
    },
    {
      icon: '📱',
      title: 'QR Code Processing',
      description: 'Scan customer QR codes for instant document access'
    },
    {
      icon: '🔐',
      title: 'Encrypted Document Viewing',
      description: 'View documents securely without local storage'
    },
    {
      icon: '📊',
      title: 'Transaction Tracking',
      description: 'Complete audit logs for all customer interactions'
    },
    {
      icon: '💳',
      title: 'Payment Integration',
      description: 'Integrated billing for printing and processing services'
    },
    {
      icon: '📍',
      title: 'Location Verification',
      description: 'Verified service provider in Pune, Maharashtra network'
    }
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: 'Basic Plan',
      price: '₹999/month',
      color: 'from-blue-500 to-blue-600',
      features: [
        'Up to 100 transactions/month',
        'Basic document printing',
        'Standard support',
        'Audit trail access',
        'QR code scanning'
      ]
    },
    {
      name: 'Professional Plan',
      price: '₹1,999/month',
      color: 'from-purple-500 to-purple-600',
      highlighted: true,
      features: [
        'Up to 500 transactions/month',
        'Advanced document processing',
        'Priority support',
        'Advanced analytics',
        'Bulk operations',
        'Custom branding'
      ]
    },
    {
      name: 'Enterprise Plan',
      price: '₹4,999/month',
      color: 'from-green-500 to-green-600',
      features: [
        'Unlimited transactions',
        'Full service suite',
        '24/7 dedicated support',
        'Custom integrations',
        'Multi-location support',
        'White-label solution'
      ]
    }
  ];

  const puneLocations = [
    'FC Road', 'Camp Area', 'Kothrud', 'Deccan Gymkhana', 
    'Shivaji Nagar', 'Pune Station', 'Baner', 'Hinjewadi'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl mr-4">
                🏪
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Service Provider Portal</h1>
                <p className="text-gray-600">Professional document services in Pune, Maharashtra</p>
              </div>
            </div>
            <Link to="/" className="text-gray-600 hover:text-gray-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center text-6xl mx-auto mb-8">
            🏢
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Professional Document Services
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join the CipherDocs network of verified service providers in Pune, Maharashtra. 
            Offer secure document printing and processing services to your customers.
          </p>
          
          <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-blue-100 px-6 py-3 rounded-full">
            <span className="text-purple-800 font-semibold">
              📍 Serving Pune, Maharashtra • 50+ Active Locations
            </span>
          </div>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Professional Services Offered
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-3xl mb-6">
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pune Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-12 mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Service Areas in Pune, Maharashtra
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {puneLocations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * index }}
                className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg px-4 py-3 text-center"
              >
                <span className="text-purple-800 font-semibold">{location}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Join our growing network of verified service providers across Pune
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              Apply for Your Location
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Pricing Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Service Provider Plans
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                  tier.highlighted ? 'ring-2 ring-purple-500 transform scale-105' : ''
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className={`text-4xl font-bold bg-gradient-to-r ${tier.color} bg-clip-text text-transparent mb-4`}>
                    {tier.price}
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-4 bg-gradient-to-r ${tier.color} text-white rounded-lg font-semibold hover:shadow-lg transition-all`}>
                  Choose Plan
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Getting Started */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Start Offering Professional Services Today
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {[
              { step: 1, title: 'Register', description: 'Sign up as a service provider', icon: '📝' },
              { step: 2, title: 'Verify', description: 'Complete location and identity verification', icon: '✅' },
              { step: 3, title: 'Setup', description: 'Install CipherDocs service tools', icon: '⚙️' },
              { step: 4, title: 'Serve', description: 'Start serving customers securely', icon: '🚀' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="space-y-4">
            <Link
              to="/rural"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all mr-4"
            >
              Access Service Portal
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <button className="inline-flex items-center px-8 py-4 border-2 border-purple-500 text-purple-600 rounded-xl font-semibold text-lg hover:bg-purple-50 transition-all">
              Register New Location
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CafePage;