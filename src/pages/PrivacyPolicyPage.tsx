import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
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
          
          <h1 className="text-4xl font-bold text-premium-900 dark:text-white mb-2">Privacy Policy</h1>
          <p className="text-premium-600 dark:text-premium-400 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <div className="prose prose-premium max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Introduction</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                At CipherDoc, we respect your privacy and are committed to protecting your personal data. This privacy policy 
                will inform you about how we look after your personal data when you visit our website and tell you about your 
                privacy rights and how the law protects you.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Important Information and Who We Are</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                CipherDoc is a secure document sharing platform that leverages blockchain technology to ensure the privacy 
                and integrity of your shared documents. We are committed to ensuring that your privacy is protected.
              </p>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                This privacy policy aims to give you information about how we collect, use, and protect your personal data. 
                It is provided in a layered format so you can click through to the specific areas set out below.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">The Data We Collect</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                We collect and process the following types of personal data:
              </p>
              <ul className="list-disc pl-6 text-premium-700 dark:text-premium-300 mb-4">
                <li><strong>Identity Data:</strong> First name, last name, username or similar identifier</li>
                <li><strong>Contact Data:</strong> Email address and telephone numbers</li>
                <li><strong>Financial Data:</strong> Blockchain wallet addresses</li>
                <li><strong>Transaction Data:</strong> Details about payments to and from you and other details of services you have purchased from us</li>
                <li><strong>Technical Data:</strong> Internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform</li>
                <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">How We Use Your Data</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                We use your personal data for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-premium-700 dark:text-premium-300 mb-4">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>To allow you to participate in interactive features of our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our services</li>
                <li>To monitor the usage of our services</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Data Security</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                We have put in place appropriate security measures to prevent your personal data from being accidentally 
                lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your 
                personal data to those employees, agents, contractors and other third parties who have a business need to 
                know. They will only process your personal data on our instructions and they are subject to a duty of 
                confidentiality.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Data Retention</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, 
                including for the purposes of satisfying any legal, accounting, or reporting requirements. Documents shared 
                through our platform are stored on IPFS (InterPlanetary File System) and secured through blockchain 
                technology, ensuring they remain accessible only to authorized parties.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Your Legal Rights</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data:
              </p>
              <ul className="list-disc pl-6 text-premium-700 dark:text-premium-300 mb-4">
                <li><strong>Request access</strong> to your personal data</li>
                <li><strong>Request correction</strong> of your personal data</li>
                <li><strong>Request erasure</strong> of your personal data</li>
                <li><strong>Object to processing</strong> of your personal data</li>
                <li><strong>Request restriction</strong> of processing your personal data</li>
                <li><strong>Request transfer</strong> of your personal data</li>
                <li><strong>Right to withdraw consent</strong></li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Contact Us</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                If you have any questions about this privacy policy or our privacy practices, please contact us:
              </p>
              <ul className="list-disc pl-6 text-premium-700 dark:text-premium-300">
                <li>Email: privacy@cipherdoc.app</li>
                <li>Telegram: @CipherDocSupport</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;