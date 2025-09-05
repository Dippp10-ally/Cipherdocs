import React, { useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import DataFlowAnimation from './animations/DataFlowAnimation';

function WhatIsCipherDoc() {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, {
    threshold: 0.2,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden');
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const features = [
    {
      name: 'On-Chain Consent',
      description: 'Your consent records are securely stored on the Algorand blockchain, ensuring immutability and transparency.',
      color: 'from-blue-500 to-indigo-600',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: 'QR Code Sharing',
      description: 'Share access to your data through QR codes or links, making it easy for others to view your shared information.',
      color: 'from-purple-500 to-pink-600',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 14H17V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 14V17H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: 'Secure Integration',
      description: 'Seamlessly integrate with WhatsApp and Telegram for easy consent sharing and management.',
      color: 'from-green-500 to-emerald-600',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      name: 'Zero-Knowledge Privacy',
      description: 'Your data remains private with zero-knowledge architecture - we never see your actual documents.',
      color: 'from-orange-500 to-red-600',
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M19.4 15C18.7 16.7 17.2 18 15.5 18.6C14.5 19 13.4 19.2 12.3 19.2C11.2 19.2 10.1 19 9.1 18.6C7.4 18 5.9 16.7 5.2 15C4.8 14 4.6 12.9 4.6 11.8C4.6 10.7 4.8 9.6 5.2 8.6C5.9 6.9 7.4 5.6 9.1 5C10.1 4.6 11.2 4.4 12.3 4.4C13.4 4.4 14.5 4.6 15.5 5C17.2 5.6 18.7 6.9 19.4 8.6C19.8 9.6 20 10.7 20 11.8C20 12.9 19.8 14 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          ref={ref}
          className="lg:text-center"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-base text-primary-400 font-semibold tracking-wide uppercase"
            variants={itemVariants}
            animate={{
              color: ['#60A5FA', '#3B82F6', '#2563EB'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            What is CipherDoc?
          </motion.h2>
          <motion.p 
            className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-white sm:text-5xl"
            variants={itemVariants}
            animate={{
              textShadow: [
                '0 0 8px rgba(59, 130, 246, 0.5)',
                '0 0 16px rgba(59, 130, 246, 0.5)',
                '0 0 8px rgba(59, 130, 246, 0.5)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            Revolutionizing Data Consent Management
          </motion.p>
          <motion.p 
            className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto"
            variants={itemVariants}
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            A decentralized platform that puts you in control of your data sharing permissions, powered by blockchain technology.
          </motion.p>
        </motion.div>

        <motion.div 
          ref={ref}
          className="mt-20"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                variants={itemVariants}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-700">
                  <motion.div 
                    className={`flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6`}
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <motion.h3 
                    className="text-xl font-bold text-white mb-4"
                    animate={{
                      textShadow: [
                        '0 0 8px rgba(255, 255, 255, 0.5)',
                        '0 0 16px rgba(255, 255, 255, 0.5)',
                        '0 0 8px rgba(255, 255, 255, 0.5)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    {feature.name}
                  </motion.h3>
                  <motion.p 
                    className="text-base text-gray-300 leading-relaxed"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    {feature.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          ref={ref}
          className="mt-24"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={controls}
          variants={itemVariants}
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">How CipherDoc Works</h3>
            <DataFlowAnimation />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default WhatIsCipherDoc;