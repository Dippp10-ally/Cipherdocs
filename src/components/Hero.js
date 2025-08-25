import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="relative overflow-hidden min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto w-full">
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
                <span className="block text-gradient">One Link,</span>
                <span className="block text-gradient">One Scan,</span>
                <span className="block text-gradient">One Consent</span>
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
                Experience the future of data sharing with ConsentChain. Securely manage your data consents through blockchain technology, QR codes, and messaging apps.
              </motion.p>

              <motion.div
                className="mt-8 sm:mt-12 sm:flex sm:justify-center lg:justify-start"
                initial="initial"
                animate="animate"
                variants={buttonContainerVariants}
              >
                <motion.div
                  className="mt-4 sm:mt-0"
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.a
                    href="#"
                    className="btn-outline w-full flex items-center justify-center px-10 py-4 text-lg font-medium md:py-5 md:text-xl md:px-12"
                    animate={{
                      borderColor: [
                        'rgba(255, 255, 255, 0.3)',
                        'rgba(255, 255, 255, 0.6)',
                        'rgba(255, 255, 255, 0.3)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    Watch Demo
                  </motion.a>
                </motion.div>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <HeroAnimation />
        </motion.div>
      </div>
    </div>
  );
}

export default Hero; 