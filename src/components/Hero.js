import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroAnimation from './animations/HeroAnimation';

function Hero() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const buttonContainerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,rgba(0,0,0,0)_70%)]"></div>
      
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
            <motion.div 
              className="sm:text-center lg:text-left"
              initial="initial"
              animate="animate"
              variants={fadeInUp}
            >
              <motion.h1 
                className="text-5xl tracking-tight font-display font-extrabold text-white sm:text-6xl md:text-7xl lg:text-8xl"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.3)',
                    '0 0 40px rgba(59, 130, 246, 0.5)',
                    '0 0 20px rgba(59, 130, 246, 0.3)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                <span className="block">One Link,</span>
                <span className="block">One Scan,</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                  One Consent
                </span>
              </motion.h1>

              <motion.p
                className="mt-6 text-xl text-gray-200 sm:mt-8 sm:text-2xl sm:max-w-xl sm:mx-auto md:mt-8 md:text-2xl lg:mx-0 leading-relaxed"
                animate={{
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              >
                Experience the future of data sharing with CipherDocs. Securely manage your data consents through blockchain technology, QR codes, and messaging apps.
              </motion.p>

              <motion.div
                className="mt-8 sm:mt-12 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4"
                initial="initial"
                animate="animate"
                variants={buttonContainerVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/share"
                    className="w-full flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    Start Sharing
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/receiver"
                    className="w-full flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all"
                  >
                    Receive Documents
                  </Link>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="mt-6 sm:mt-8 flex items-center justify-center lg:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center text-gray-300 text-sm">
                  <span className="flex h-3 w-3 relative mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span>Trusted by 10,000+ users worldwide</span>
                </div>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
      
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
            <HeroAnimation />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;