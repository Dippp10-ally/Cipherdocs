import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16"> {/* Add padding-top to account for fixed navbar */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;