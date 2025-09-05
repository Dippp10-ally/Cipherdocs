import React from 'react';
import { motion } from 'framer-motion';

const DataFlowAnimation = () => {
  const floatingAnimation = {
    y: [0, -15, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const dataFlowAnimation = {
    y: [0, -5, 0],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="relative w-full h-[500px]">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-accent-500/20 to-primary-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Sender Device */}
      <motion.div
        className="absolute left-1/4 top-1/3 transform -translate-x-1/2 -translate-y-1/2"
        animate={floatingAnimation}
      >
        <div className="relative">
          <svg width="120" height="200" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="100" height="180" rx="15" fill="#1F2937" />
            <rect x="15" y="15" width="90" height="170" rx="12" fill="#111827" />
            <circle cx="60" cy="190" r="6" fill="#374151" />
            <rect x="25" y="30" width="70" height="10" rx="5" fill="#3B82F6" />
            <rect x="25" y="50" width="50" height="8" rx="4" fill="#60A5FA" />
            <rect x="25" y="70" width="60" height="8" rx="4" fill="#93C5FD" />
          </svg>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </motion.div>

      {/* Data Flow Path */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={dataFlowAnimation}
      >
        <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 10H200" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Blockchain Nodes */}
      <motion.div
        className="absolute left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2"
        animate={pulseAnimation}
      >
        <div className="flex space-x-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Receiver Device */}
      <motion.div
        className="absolute right-1/4 top-2/3 transform translate-x-1/2 -translate-y-1/2"
        animate={floatingAnimation}
      >
        <div className="relative">
          <svg width="120" height="200" viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="100" height="180" rx="15" fill="#1F2937" />
            <rect x="15" y="15" width="90" height="170" rx="12" fill="#111827" />
            <circle cx="60" cy="190" r="6" fill="#374151" />
            <rect x="25" y="30" width="70" height="10" rx="5" fill="#10B981" />
            <rect x="25" y="50" width="50" height="8" rx="4" fill="#34D399" />
            <rect x="25" y="70" width="60" height="8" rx="4" fill="#6EE7B7" />
          </svg>
          <div className="absolute -top-2 -left-2 w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </motion.div>

      {/* Floating Data Packets */}
      <motion.div
        className="absolute left-1/3 top-1/2"
        animate={{
          x: [0, 200],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-400 to-primary-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        className="absolute left-1/3 top-1/2"
        animate={{
          x: [0, 200],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-secondary-400 to-secondary-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        className="absolute left-1/3 top-1/2"
        animate={{
          x: [0, 200],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-accent-400 to-accent-600 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </motion.div>

      {/* Security Shield */}
      <motion.div
        className="absolute left-1/2 top-3/4 transform -translate-x-1/2 -translate-y-1/2"
        animate={pulseAnimation}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};

export default DataFlowAnimation;