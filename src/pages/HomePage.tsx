import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DataFlowAnimation from '../components/animations/DataFlowAnimation';

const HomePage: React.FC = () => {
  const [email, setEmail] = useState('');

  // Features data
  const features = [
    {
      title: "Blockchain Security",
      description: "Immutable document records secured on the Algorand blockchain for maximum trust and transparency.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      color: "from-primary-500 to-primary-600"
    },
    {
      title: "Instant Sharing",
      description: "Share documents in seconds with our streamlined interface and multiple sharing options.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
      color: "from-secondary-500 to-secondary-600"
    },
    {
      title: "Audit Trail",
      description: "Complete visibility into who accessed your documents and when with detailed audit logs.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: "from-accent-500 to-accent-600"
    }
  ];

  // Stats data
  const stats = [
    { value: "10K+", label: "Secure Documents Shared" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "256-bit", label: "Encryption Standard" },
    { value: "Zero", label: "Data Breaches" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-50 to-premium-100 dark:from-premium-900 dark:to-premium-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl md:text-6xl font-display font-bold text-premium-900 dark:text-white mb-6">
                Secure Document Sharing
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                  Reimagined
                </span>
              </h1>
              <p className="text-xl text-premium-700 dark:text-premium-300 mb-8 max-w-lg">
                Experience the future of data privacy with blockchain-secured document management. 
                Share documents with confidence, knowing every interaction is verified and auditable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/share" 
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center"
                >
                  Start Sharing
                </Link>
                <Link 
                  to="/receiver" 
                  className="px-8 py-4 bg-white dark:bg-premium-800 text-premium-900 dark:text-white rounded-xl font-semibold border-2 border-premium-200 dark:border-premium-700 hover:border-primary-300 dark:hover:border-primary-500 transition-all duration-300 shadow hover:shadow-lg transform hover:-translate-y-1 text-center"
                >
                  Access Documents
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <DataFlowAnimation />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 bg-gradient-to-r from-primary-500/10 to-secondary-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-premium-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-premium-700 dark:text-premium-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-display font-bold text-premium-900 dark:text-white mb-4"
            >
              Powerful Features
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-premium-700 dark:text-premium-300 max-w-2xl mx-auto"
            >
              Everything you need for secure, compliant document sharing
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white dark:bg-premium-800 rounded-2xl p-8 border border-premium-200 dark:border-premium-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-premium-700 dark:text-premium-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gradient-to-br from-premium-100 to-premium-200 dark:from-premium-800 dark:to-premium-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-display font-bold text-premium-900 dark:text-white mb-4"
            >
              How It Works
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-premium-700 dark:text-premium-300 max-w-2xl mx-auto"
            >
              Simple steps to secure document sharing
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Document",
                description: "Upload your document and set sharing permissions with expiration dates and access limits."
              },
              {
                step: "02",
                title: "Share Securely",
                description: "Send the document link via email, SMS, or directly to the recipient's CipherDoc account."
              },
              {
                step: "03",
                title: "Track & Verify",
                description: "Monitor all access in real-time with detailed audit logs and blockchain verification."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white dark:bg-premium-800 rounded-2xl p-8 border border-premium-200 dark:border-premium-700 shadow-lg text-center h-full">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">{item.title}</h3>
                  <p className="text-premium-700 dark:text-premium-300">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-display font-bold text-white mb-6"
          >
            Ready to Secure Your Documents?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-primary-100 max-w-2xl mx-auto mb-10"
          >
            Join thousands of professionals who trust CipherDoc for secure document sharing
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-md mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/share" 
                className="px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold hover:bg-premium-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center flex-1"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;