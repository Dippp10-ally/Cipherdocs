import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface SharedDocument {
  shareId: string;
  receiverInfo: {
    method: string;
    value: string;
    name?: string;
  };
  documents: any[];
  permissions: {
    canView: boolean;
    canPrint: boolean;
    canDownload: boolean;
    timeLimit: number;
    selectedDocuments: string[];
  };
  timestamp: string;
  expiresAt: string;
}

const ReceiverPage: React.FC = () => {
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authInput, setAuthInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [isViewerOpen, setIsViewerOpen] = useState<boolean>(false);

  // Function to handle document viewing
  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
    setIsViewerOpen(true);
  };

  // Function to handle document printing
  const handlePrintDocument = (doc: any) => {
    // Determine content source (IPFS hash, direct content, or file)
    let contentUrl = '';
    if (doc.ipfsHash) {
      contentUrl = `https://gateway.pinata.cloud/ipfs/${doc.ipfsHash}`;
    } else if (doc.content) {
      contentUrl = doc.content;
    } else if (doc.file) {
      contentUrl = doc.file;
    } else if (doc.url) {
      contentUrl = doc.url;
    }

    if (!contentUrl) {
      alert('Document content not available for printing.');
      return;
    }

    // For images and PDFs, open directly in new tab for printing
    if (doc.type && (doc.type.startsWith('image/') || doc.type === 'application/pdf')) {
      const printTab = window.open(contentUrl, '_blank');
      if (printTab) {
        printTab.focus();
        // Try to print after content loads
        setTimeout(() => {
          try {
            printTab.print();
          } catch (error) {
            console.log('Auto-print not possible, user can manually print');
          }
        }, 3000);
      } else {
        alert('Pop-up blocked. Please allow pop-ups and try again.');
      }
      return;
    }

    // For other file types, create a formatted print page
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      let documentContent = '';
      
      if (doc.type && doc.type.startsWith('text/')) {
        // For text files, we'll try to fetch content
        documentContent = `
          <div id="text-content" style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ddd;">
            <div style="text-align: center; padding: 20px;">
              <div style="font-size: 24px; margin-bottom: 10px;">🔄</div>
              <p style="color: #666;">Loading document content...</p>
              <p style="color: #888; font-size: 12px;">URL: ${contentUrl}</p>
            </div>
          </div>
          <script>
            fetch('${contentUrl}')
              .then(response => {
                if (!response.ok) throw new Error('Failed to fetch');
                return response.text();
              })
              .then(text => {
                document.getElementById('text-content').innerHTML = 
                  '<pre style="white-space: pre-wrap; font-family: \'Courier New\', monospace; font-size: 12px; line-height: 1.5; margin: 0; padding: 20px; background: white; border-radius: 8px;">' + 
                  text.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
              })
              .catch(error => {
                console.error('Error loading content:', error);
                document.getElementById('text-content').innerHTML = 
                  '<div style="text-align: center; padding: 20px;">' +
                  '<div style="font-size: 48px; margin-bottom: 16px;">📝</div>' +
                  '<h3 style="color: #333; margin-bottom: 8px;">Text Document</h3>' +
                  '<p style="color: #666; margin-bottom: 8px;">File: ${doc.name}</p>' +
                  '<p style="color: #888; font-size: 14px;">Content could not be loaded automatically.</p>' +
                  '<a href="${contentUrl}" target="_blank" style="color: #4F46E5; text-decoration: none; font-weight: bold;">' +
                  '🔗 Open Document in New Tab' +
                  '</a>' +
                  '</div>';
              });
          </script>
        `;
      } else {
        // For other file types, show file info and link
        documentContent = `
          <div style="text-align: center; margin: 20px 0; padding: 40px; background: #f5f5f5; border-radius: 8px; border: 1px solid #ddd;">
            <div style="font-size: 48px; margin-bottom: 16px;">📄</div>
            <h3 style="color: #333; margin-bottom: 8px;">Document File</h3>
            <p style="color: #666; margin-bottom: 8px;"><strong>Name:</strong> ${doc.name}</p>
            <p style="color: #666; margin-bottom: 8px;"><strong>Type:</strong> ${doc.type || 'Unknown'}</p>
            <p style="color: #666; margin-bottom: 16px;"><strong>Size:</strong> ${(doc.size / 1024).toFixed(1)} KB</p>
            ${doc.ipfsHash ? `<p style="color: #666; margin-bottom: 16px; font-size: 11px; font-family: monospace; background: #e9ecef; padding: 8px; border-radius: 4px; word-break: break-all;"><strong>IPFS:</strong> ${doc.ipfsHash}</p>` : ''}
            <div style="margin: 20px 0;">
              <a href="${contentUrl}" target="_blank" 
                 style="display: inline-block; background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                🔗 Open Document to Print
              </a>
            </div>
            <p style="color: #888; font-size: 12px;">This document will open in a new tab where you can print it.</p>
          </div>
        `;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Print Document - ${doc.name}</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .document-info {
              background: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 25px;
              border: 1px solid #e9ecef;
            }
            .document-info h2 {
              margin-top: 0;
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
            }
            .info-row {
              margin-bottom: 8px;
            }
            .info-label {
              font-weight: bold;
              display: inline-block;
              width: 120px;
            }
            .content {
              margin-top: 25px;
            }
            .content h3 {
              color: #333;
              border-bottom: 1px solid #ddd;
              padding-bottom: 8px;
            }
            @media print {
              .no-print { display: none; }
              body { margin: 10px; }
              a { color: #333 !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CipherDocs - Document Print</h1>
            <p>Secure Document Sharing Platform</p>
          </div>
          
          <div class="document-info">
            <h2>Document Information</h2>
            <div class="info-row">
              <span class="info-label">Name:</span> ${doc.name}
            </div>
            <div class="info-row">
              <span class="info-label">Type:</span> ${doc.type || 'Unknown'}
            </div>
            <div class="info-row">
              <span class="info-label">Size:</span> ${(doc.size / 1024).toFixed(1)} KB
            </div>
            ${doc.ipfsHash ? `
            <div class="info-row">
              <span class="info-label">IPFS Hash:</span> <span style="font-family: monospace; font-size: 11px;">${doc.ipfsHash}</span>
            </div>` : ''}
            <div class="info-row">
              <span class="info-label">Print Date:</span> ${new Date().toLocaleString()}
            </div>
            <div class="info-row">
              <span class="info-label">Location:</span> Pune, Maharashtra
            </div>
            <div class="info-row">
              <span class="info-label">Source:</span> <span style="font-size: 11px; word-break: break-all;">${contentUrl}</span>
            </div>
          </div>
          
          <div class="content">
            <h3>Document Content</h3>
            ${documentContent}
          </div>
          
          <div class="no-print" style="margin-top: 30px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px;">
            <button onclick="window.print()" style="background: #4F46E5; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px; font-size: 14px;">
              🖨️ Print This Page
            </button>
            <button onclick="window.open('${contentUrl}', '_blank')" style="background: #059669; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; margin-right: 10px; font-size: 14px;">
              🔗 Open Original
            </button>
            <button onclick="window.close()" style="background: #6B7280; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
              Close
            </button>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      
      console.log('Print window opened for:', doc.name, 'with URL:', contentUrl);
    } else {
      alert('Pop-up blocked. Please allow pop-ups and try again.');
    }
  };

  // Function to close document viewer
  const closeViewer = () => {
    setIsViewerOpen(false);
    setSelectedDocument(null);
  };

  // Check for shared documents on page load and periodically
  useEffect(() => {
    const checkForSharedDocuments = () => {
      const storedData = localStorage.getItem('shared_documents');
      if (storedData && isAuthenticated) {
        try {
          const shareData: SharedDocument = JSON.parse(storedData);
          const now = new Date();
          const expiresAt = new Date(shareData.expiresAt);
          
          if (now < expiresAt) {
            setSharedDocuments(shareData);
            setTimeRemaining(Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000)));
          } else {
            // Documents have expired
            localStorage.removeItem('shared_documents');
            setSharedDocuments(null);
          }
        } catch (error) {
          console.error('Error parsing shared documents:', error);
        }
      }
    };

    // Check immediately
    checkForSharedDocuments();
    
    // Check every 5 seconds for new documents (only if authenticated)
    const interval = setInterval(checkForSharedDocuments, 5000);
    
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Authentication function
  const handleAuthentication = () => {
    const storedData = localStorage.getItem('shared_documents');
    if (!storedData) {
      setAuthError('No documents have been shared with you.');
      return;
    }

    try {
      const shareData: SharedDocument = JSON.parse(storedData);
      const receiverEmail = shareData.receiverInfo.value.toLowerCase();
      const inputEmail = authInput.toLowerCase().trim();

      // Check if the entered email/phone matches the intended receiver
      if (inputEmail === receiverEmail) {
        setIsAuthenticated(true);
        setAuthError('');
        
        // Check if documents are still valid
        const now = new Date();
        const expiresAt = new Date(shareData.expiresAt);
        
        if (now >= expiresAt) {
          localStorage.removeItem('shared_documents');
          setAuthError('Documents have expired.');
          setIsAuthenticated(false);
        }
      } else {
        setAuthError('You are not authorized to access these documents. Please check your email/phone number/CipherDocs ID.');
      }
    } catch (error) {
      setAuthError('Error checking authentication.');
    }
  };

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      
      if (timeRemaining === 1) {
        // Documents expired
        localStorage.removeItem('shared_documents');
        setSharedDocuments(null);
      }
      
      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If not authenticated, show authentication interface
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-2xl mr-4">
                  📥
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Document Receiver</h1>
                  <p className="text-gray-600">Verify your identity to access shared documents</p>
                </div>
              </div>
              <Link to="/" className="text-gray-600 hover:text-gray-800 font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Authentication Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                🔐
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Verify Your Identity
              </h2>
              <p className="text-gray-600">
                Enter your email, phone number, or CipherDocs ID to access documents shared with you
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email, Phone Number, or CipherDocs ID
                </label>
                <input
                  type="text"
                  value={authInput}
                  onChange={(e) => setAuthInput(e.target.value)}
                  placeholder="Enter email, phone number, or CipherDocs ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAuthentication()}
                />
              </div>
              
              {authError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">
                    X {authError}
                  </p>
                </div>
              )}
              
              <button
                onClick={handleAuthentication}
                disabled={!authInput.trim()}
                className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-semibold disabled:cursor-not-allowed transition-all"
              >
                🔓 Access My Documents
              </button>
            </div>
            
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  i
                </div>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Security Notice:</p>
                  <p>• Only the intended recipient can access shared documents</p>
                  <p>• You must enter the exact email/phone/ID the sender used</p>
                  <p>• Documents expire automatically for security</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 text-center"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              How to Access Documents
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl font-bold mx-auto mb-3">
                  1
                </div>
                <h4 className="font-medium mb-2">Get Notification</h4>
                <p className="text-sm text-gray-600">
                  Sender shares documents and notifies you via SMS/email
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl font-bold mx-auto mb-3">
                  2
                </div>
                <h4 className="font-medium mb-2">Verify Identity</h4>
                <p className="text-sm text-gray-600">
                  Enter the exact email/phone/CipherDocs ID sender used to identify you
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 text-xl font-bold mx-auto mb-3">
                  3
                </div>
                <h4 className="font-medium mb-2">Access Documents</h4>
                <p className="text-sm text-gray-600">
                  View and print documents with time-limited access
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // If documents are shared and authenticated, show the access interface
  if (sharedDocuments) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">
              ✓
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Documents Received!
            </h1>
            <p className="text-gray-600">
              You have received {sharedDocuments.documents.length} document(s) with access expiring in {formatTime(timeRemaining)}
            </p>
          </div>
          
          {/* Timer Warning */}
          <div className={`text-center mb-6 ${timeRemaining < 300 ? 'animate-pulse' : ''}`}>
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${
              timeRemaining < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              TIME: {formatTime(timeRemaining)}
            </div>
          </div>
          
          {/* Documents List */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">Available Documents</h3>
            
            <div className="space-y-4">
              {sharedDocuments.documents.map((doc, index) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold mr-4">
                      DOC
                    </div>
                    <div>
                      <h4 className="font-semibold">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.type} • {(doc.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {sharedDocuments.permissions.canView && (
                      <button 
                        onClick={() => handleViewDocument(doc)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        VIEW
                      </button>
                    )}
                    {sharedDocuments.permissions.canPrint && (
                      <button 
                        onClick={() => handlePrintDocument(doc)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors"
                      >
                        PRINT
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Permissions Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h4 className="font-semibold text-gray-800 mb-4">Your Access Permissions</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className={`p-3 rounded-lg ${
                sharedDocuments.permissions.canView ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                VIEW: {sharedDocuments.permissions.canView ? 'Allowed' : 'Denied'}
              </div>
              <div className={`p-3 rounded-lg ${
                sharedDocuments.permissions.canPrint ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                PRINT: {sharedDocuments.permissions.canPrint ? 'Allowed' : 'Denied'}
              </div>
              <div className="p-3 rounded-lg bg-red-100 text-red-800">
                DOWNLOAD: Disabled
              </div>
              <div className="p-3 rounded-lg bg-blue-100 text-blue-800">
                DURATION: {sharedDocuments.permissions.timeLimit} min
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="text-center space-x-4">
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setAuthInput('');
                setSharedDocuments(null);
              }}
              className="px-6 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 font-medium"
            >
              LOGOUT
            </button>
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Back to Home
            </Link>
          </div>
          
          {/* Document Viewer Modal */}
          {isViewerOpen && selectedDocument && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">DOC: {selectedDocument.name}</h2>
                      <p className="text-blue-100 mt-1">
                        {selectedDocument.type} • {(selectedDocument.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={closeViewer}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Modal Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-semibold text-gray-700">File Type:</span>
                        <p className="text-gray-600">{selectedDocument.type}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Size:</span>
                        <p className="text-gray-600">{(selectedDocument.size / 1024).toFixed(1)} KB</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Access Time:</span>
                        <p className="text-gray-600">{formatTime(timeRemaining)} remaining</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Location:</span>
                        <p className="text-gray-600">Pune, Maharashtra</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Document Content */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    {selectedDocument.type && selectedDocument.type.startsWith('image/') ? (
                      <div className="space-y-4">
                        <img 
                          src={selectedDocument.ipfsHash ? `https://gateway.pinata.cloud/ipfs/${selectedDocument.ipfsHash}` : selectedDocument.content || selectedDocument.file || selectedDocument.url} 
                          alt={selectedDocument.name}
                          className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'block';
                            }
                          }}
                        />
                        <div style={{display: 'none'}} className="space-y-4">
                          <div className="text-6xl font-bold">IMG</div>
                          <h3 className="text-xl font-semibold text-gray-800">Image Document</h3>
                          <p className="text-gray-600">Image preview not available</p>
                          <p className="text-sm text-gray-500">File: {selectedDocument.name}</p>
                          {selectedDocument.ipfsHash && (
                            <a 
                              href={`https://gateway.pinata.cloud/ipfs/${selectedDocument.ipfsHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              🔗 Open in New Tab
                            </a>
                          )}
                        </div>
                      </div>
                    ) : selectedDocument.type === 'application/pdf' ? (
                      <div className="space-y-4">
                        <div className="text-6xl font-bold">PDF</div>
                        <h3 className="text-xl font-semibold text-gray-800">PDF Document</h3>
                        <p className="text-gray-600">PDF preview and full content available in print mode</p>
                        {(selectedDocument.ipfsHash || selectedDocument.content || selectedDocument.file || selectedDocument.url) && (
                          <div className="space-y-4">
                            <iframe 
                              src={selectedDocument.ipfsHash ? `https://gateway.pinata.cloud/ipfs/${selectedDocument.ipfsHash}` : selectedDocument.content || selectedDocument.file || selectedDocument.url}
                              className="w-full h-96 border rounded-lg"
                              title={selectedDocument.name}
                            />
                            <a 
                              href={selectedDocument.ipfsHash ? `https://gateway.pinata.cloud/ipfs/${selectedDocument.ipfsHash}` : selectedDocument.content || selectedDocument.file || selectedDocument.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                              🔗 Open PDF in New Tab
                            </a>
                          </div>
                        )}
                      </div>
                    ) : selectedDocument.type && selectedDocument.type.startsWith('text/') ? (
                      <div className="space-y-4">
                        <div className="text-6xl font-bold">TXT</div>
                        <h3 className="text-xl font-semibold text-gray-800">Text Document</h3>
                        <p className="text-gray-600">File: {selectedDocument.name}</p>
                        <div className="bg-white p-4 rounded border text-left max-h-64 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm font-mono">
                            {selectedDocument.content || selectedDocument.file || 'Content loading from IPFS...'}
                          </pre>
                        </div>
                        {selectedDocument.ipfsHash && (
                          <a 
                            href={`https://gateway.pinata.cloud/ipfs/${selectedDocument.ipfsHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            🔗 View Full Content
                          </a>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-6xl font-bold">DOC</div>
                        <h3 className="text-xl font-semibold text-gray-800">Document File</h3>
                        <p className="text-gray-600">File: {selectedDocument.name}</p>
                        <p className="text-gray-600">Type: {selectedDocument.type || 'Unknown'}</p>
                        <div className="bg-white p-4 rounded border">
                          {selectedDocument.ipfsHash ? (
                            <div className="space-y-3">
                              <p className="text-sm text-gray-600">Document stored on IPFS</p>
                              <p className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                                Hash: {selectedDocument.ipfsHash}
                              </p>
                              <a 
                                href={`https://gateway.pinata.cloud/ipfs/${selectedDocument.ipfsHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                🔗 View/Download File
                              </a>
                            </div>
                          ) : (selectedDocument.content || selectedDocument.file) ? (
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Document content available</p>
                              <p className="text-sm text-gray-500">Use the Print button to view formatted content</p>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Content preview not available for this file type</p>
                          )}
                        </div>
                      </div>
                    )}
                    {/* Error fallback for images */}
                    <div style={{display: 'none'}} className="space-y-4">
                      <div className="text-6xl">🖼️</div>
                      <h3 className="text-xl font-semibold text-gray-800">Image Document</h3>
                      <p className="text-gray-600">Image preview not available</p>
                      <p className="text-sm text-gray-500">Try using the Print button to view the image</p>
                    </div>
                  </div>
                  
                  {/* Modal Actions */}
                  <div className="flex justify-center space-x-4 mt-6">
                    {sharedDocuments.permissions.canPrint && (
                      <button
                        onClick={() => handlePrintDocument(selectedDocument)}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                      >
                        PRINT Document
                      </button>
                    )}
                    <button
                      onClick={closeViewer}
                      className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Close Viewer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // No shared documents found - show waiting interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xs mr-4">
                RCV
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Receiver</h1>
                <p className="text-gray-600">Waiting for documents to be shared with you</p>
              </div>
            </div>
            <Link to="/" className="text-gray-600 hover:text-gray-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Waiting State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-blue-600 rounded-3xl flex items-center justify-center text-6xl mx-auto mb-8 animate-pulse">
            📭
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            No Documents Available
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            You haven't received any documents yet. When someone shares documents with you,
            they will appear here automatically.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                i
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-2">How to receive documents:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Ask the sender to share documents with your email/phone</li>
                  <li>Return to this page after they share</li>
                  <li>Enter your email/phone to verify your identity</li>
                  <li>Access your documents securely</li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            🔄 Check for New Documents
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiverPage;