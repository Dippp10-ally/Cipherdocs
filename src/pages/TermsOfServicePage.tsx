import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfServicePage: React.FC = () => {
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
          
          <h1 className="text-4xl font-bold text-premium-900 dark:text-white mb-2">Terms of Service</h1>
          <p className="text-premium-600 dark:text-premium-400 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <div className="prose prose-premium max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Introduction</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                Welcome to CipherDoc. These terms of service outline the rules and regulations for the use of CipherDoc's 
                website and services. By accessing this website, we assume you accept these terms of service in full. 
                Do not continue to use CipherDoc's website if you do not accept all of the terms of service stated on this page.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">License to Use Website</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                Unless otherwise stated, CipherDoc and/or its licensors own the intellectual property rights in the website 
                and material on the website. Subject to the license below, all these intellectual property rights are reserved.
              </p>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                You may view, download for caching purposes only, and print pages from the website for your own personal use, 
                subject to the restrictions set out below and elsewhere in these terms of service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Acceptable Use</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                You must not use this website in any way that causes, or may cause, damage to the website or impairment of 
                the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent or harmful, 
                or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.
              </p>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                You must not use this website to copy, store, host, transmit, send, use, publish or distribute any material 
                which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit 
                or other malicious computer software.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Document Sharing</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                CipherDoc provides a platform for secure document sharing using blockchain technology. You are responsible for 
                ensuring that any documents you share through our platform comply with all applicable laws and regulations.
              </p>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                You must not use CipherDoc to share any documents that:
              </p>
              <ul className="list-disc pl-6 text-premium-700 dark:text-premium-300 mb-4">
                <li>Infringe any intellectual property rights</li>
                <li>Contain malicious code or software</li>
                <li>Are illegal or promote illegal activities</li>
                <li>Violate the privacy or rights of others</li>
                <li>Contain false or misleading information</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Blockchain Integration</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                CipherDoc integrates with the Algorand blockchain to provide immutable records of document sharing consents. 
                By using our services, you acknowledge and agree that:
              </p>
              <ul className="list-disc pl-6 text-premium-700 dark:text-premium-300 mb-4">
                <li>Transaction data may be stored on the Algorand blockchain</li>
                <li>Such data may be publicly accessible</li>
                <li>You are responsible for maintaining the security of your wallet and private keys</li>
                <li>CipherDoc is not responsible for any loss of funds or access due to your actions</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Limitation of Liability</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                CipherDoc will not be liable to you (whether under the law of contract, the law of torts or otherwise) in 
                relation to the contents of, or use of, or otherwise in connection with, this website:
              </p>
              <ul className="list-disc pl-6 text-premium-700 dark:text-premium-300 mb-4">
                <li>To the extent that the website is provided free-of-charge</li>
                <li>For any indirect, special or consequential loss</li>
                <li>For any business losses, loss of revenue, income, profits or anticipated savings</li>
                <li>For any loss of contracts or business</li>
                <li>For any loss of anticipated savings</li>
                <li>For any loss of data</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Variation</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                CipherDoc may revise these terms of service from time-to-time. Revised terms of service will apply to the use 
                of this website from the date of the publication of the revised terms of service on this website. Please check 
                this page regularly to ensure you are familiar with the current version.
              </p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-premium-900 dark:text-white mb-4">Contact Us</h2>
              <p className="text-premium-700 dark:text-premium-300 mb-4">
                If you have any questions about these terms of service, please contact us:
              </p>
              <ul className="list-disc pl-6 text-premium-700 dark:text-premium-300">
                <li>Email: legal@cipherdoc.app</li>
                <li>Telegram: @CipherDocSupport</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;