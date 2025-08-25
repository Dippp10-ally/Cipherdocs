import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mr-3">
                CD
              </div>
              <div>
                <h3 className="text-lg font-bold">CipherDocs</h3>
                <p className="text-sm text-gray-400">Pune, Maharashtra</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Secure document sharing platform built with blockchain technology for enhanced security and privacy.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/share" className="text-gray-400 hover:text-white transition-colors">
                  Share Documents
                </a>
              </li>
              <li>
                <a href="/receiver" className="text-gray-400 hover:text-white transition-colors">
                  Receive Documents
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Pune, Maharashtra, India</p>
              <p>Secure Document Solutions</p>
              <p className="text-xs mt-4">
                Built with React, TypeScript & Blockchain Technology
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} CipherDocs. All rights reserved. | Pune, Maharashtra
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;