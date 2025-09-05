import React from 'react';
import { Link } from 'react-router-dom';

const SecurityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-premium-50 to-premium-100 dark:from-premium-900 dark:to-premium-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-premium-800 rounded-2xl shadow-xl p-8">
          <Link to="/" className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 mb-6">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-premium-900 dark:text-white mb-2">Security</h1>
          <p className="text-premium-600 dark:text-premium-400 mb-8">Learn about how we protect your data and documents</p>
          
          <div className="prose prose-premium max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Our Security Commitment</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                At CipherDoc, security is at the core of everything we do. We employ industry-leading security practices 
                to ensure your documents and data are protected at all times. Our platform leverages blockchain technology 
                to provide an immutable audit trail of all document sharing activities.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">End-to-End Encryption</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                All documents shared through CipherDoc are encrypted using AES-256 encryption before being stored on IPFS. 
                Only authorized recipients with the proper decryption keys can access your documents. These keys are never 
                stored on our servers, ensuring that even we cannot access your documents.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Blockchain Verification</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                Every document sharing consent is recorded on the Algorand blockchain, creating an immutable and tamper-proof 
                record of all activities. This ensures complete transparency and accountability while maintaining the privacy 
                of your documents.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Zero-Knowledge Architecture</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                CipherDoc follows a zero-knowledge architecture, meaning we have no way to access or view your documents. 
                All encryption and decryption happen on your device, and we never store plaintext versions of your files.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Secure Wallet Integration</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                Our platform integrates with Pera Wallet to provide secure blockchain transactions. Your wallet credentials 
                are never stored on our servers, and all wallet interactions happen directly between your device and the 
                Algorand network.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Access Controls</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                We implement role-based access controls to ensure that only authorized users can access specific documents. 
                Document owners can set expiration dates, access limits, and revoke permissions at any time.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Regular Security Audits</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                We conduct regular security audits of our infrastructure and codebase to identify and address potential 
                vulnerabilities. Our platform is continuously monitored for suspicious activities and potential threats.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Compliance</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                CipherDoc is designed to help organizations meet compliance requirements for data protection regulations 
                including GDPR, HIPAA, and other relevant standards. Our blockchain-based audit trail provides complete 
                visibility into document access and sharing activities.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Reporting Security Issues</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                If you discover a security vulnerability in our platform, please report it to us immediately:
              </p>
              <ul className="list-disc pl-6 text-premium-700 dark:text-premium-300">
                <li>Email: security@cipherdoc.app</li>
                <li>Telegram: @CipherDocSecurity</li>
              </ul>
              <p className="text-premium-700 dark:text-premium-300 mt-4">
                We appreciate responsible disclosure and will work with you to address any issues promptly.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage;