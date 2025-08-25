import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Essential Pages
import HomePage from './pages/HomePage';
import UnifiedSharingPage from './pages/UnifiedSharingPage';
import ReceiverPage from './pages/ReceiverPage';

// Essential Components
import Navbar from './components/core/Navbar';
import Footer from './components/core/Footer';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/share" element={<UnifiedSharingPage />} />
            <Route path="/receiver" element={<ReceiverPage />} />
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                  <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg">
                    Go Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;