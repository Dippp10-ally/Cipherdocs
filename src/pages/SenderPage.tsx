import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import DocumentUpload from '../components/DocumentUpload';

interface SenderDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  ipfsHash?: string;
  sensitive?: boolean;
}

const SenderPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'identify-receiver' | 'upload' | 'set-permissions' | 'approve-consent'>('welcome');
  const [uploadedDocs, setUploadedDocs] = useState<SenderDocument[]>([]);
  const [receiverInfo, setReceiverInfo] = useState<{
    method: 'qr' | 'email' | 'phone' | null;
    value: string;
    name?: string;
  }>({ method: null, value: '' });
  const [permissions, setPermissions] = useState({
    canView: true,
    canPrint: true,
    canDownload: false,
    timeLimit: 30, // minutes
    selectedDocuments: [] as string[]
  });

  const steps = [
    { id: 'welcome', title: 'Welcome', icon: 'STEP-1' },
    { id: 'identify-receiver', title: 'Receiver', icon: 'STEP-2' },
    { id: 'upload', title: 'Upload', icon: 'STEP-3' },
    { id: 'set-permissions', title: 'Permissions', icon: 'STEP-4' },
    { id: 'approve-consent', title: 'Approve', icon: 'STEP-5' }
  ];

  const handleDocumentsUploaded = (documents: any[]) => {
    // Convert to SenderDocument format
    const senderDocs: SenderDocument[] = documents.map(doc => ({
      ...doc,
      size: typeof doc.size === 'string' ? parseInt(doc.size) || 0 : doc.size
    }));
    setUploadedDocs(senderDocs);
    
    // Auto-select all uploaded documents by default
    setPermissions(prev => ({
      ...prev,
      selectedDocuments: senderDocs.map(doc => doc.id)
    }));
    
    setCurrentStep('set-permissions');
  };

  const renderWelcomeStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center max-w-4xl mx-auto"
    >
      <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-8">
        SEND
      </div>
      
      <h1 className="text-5xl font-bold text-gray-900 mb-6">
        Send Documents Securely
      </h1>
      
      <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
        Share your documents with complete security, time-limited access, and full audit trails. 
        Perfect for official documents, contracts, and sensitive information.
      </p>
      
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl mb-4 mx-auto">
            SEC
          </div>
          <h3 className="text-xl font-bold mb-3">End-to-End Encryption</h3>
          <p className="text-gray-600">Your documents are encrypted before upload using military-grade AES-256 encryption.</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-green-600 font-bold text-xl mb-4 mx-auto">
            TIME
          </div>
          <h3 className="text-xl font-bold mb-3">Time-Limited Access</h3>
          <p className="text-gray-600">Set custom expiration times for document access with automatic revocation.</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 font-bold text-xl mb-4 mx-auto">
            AUDIT
          </div>
          <h3 className="text-xl font-bold mb-3">Complete Audit Trail</h3>
          <p className="text-gray-600">Track every access, view, and action taken on your shared documents.</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <button
          onClick={() => setCurrentStep('identify-receiver')}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
        >
          Start Document Sharing
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        <div className="text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </motion.div>
  );

  const renderUploadStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Upload Your Documents
        </h1>
        <p className="text-xl text-gray-600">
          Securely upload documents to share with {receiverInfo.value || 'receiver'}
        </p>
        {receiverInfo.value && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-md mx-auto mt-4">
            <p className="text-green-800 text-sm">
              📧 Sharing with: {receiverInfo.value}
              {receiverInfo.name && ` (${receiverInfo.name})`}
            </p>
          </div>
        )}
      </div>
      
      <DocumentUpload
        onDocumentsUploaded={handleDocumentsUploaded}
        onBack={() => setCurrentStep('identify-receiver')}
      />
    </motion.div>
  );

  const renderIdentifyReceiverStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Who will receive the documents?
        </h1>
        <p className="text-xl text-gray-600">
          Choose how to identify the document receiver
        </p>
      </div>
      
      {/* Receiver Identification Methods */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* QR Code Scan */}
        <div className={`bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all hover:shadow-xl border-2 ${
          receiverInfo.method === 'qr' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
        onClick={() => setReceiverInfo({ method: 'qr', value: '' })}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-bold text-xl mb-6 mx-auto">
            QR
          </div>
          <h3 className="text-xl font-bold text-center mb-4">Scan Receiver QR</h3>
          <p className="text-gray-600 text-center text-sm">
            Scan the receiver's QR code from their CipherDocs app
          </p>
        </div>
        
        {/* Email Entry */}
        <div className={`bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all hover:shadow-xl border-2 ${
          receiverInfo.method === 'email' ? 'border-green-500 bg-green-50' : 'border-gray-200'
        }`}
        onClick={() => setReceiverInfo({ method: 'email', value: '' })}
        >
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 font-bold text-xl mb-6 mx-auto">
            EMAIL
          </div>
          <h3 className="text-xl font-bold text-center mb-4">Enter Email</h3>
          <p className="text-gray-600 text-center text-sm">
            Enter the receiver's email address to send documents
          </p>
        </div>
        
        {/* Phone Number */}
        <div className={`bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all hover:shadow-xl border-2 ${
          receiverInfo.method === 'phone' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'
        }`}
        onClick={() => setReceiverInfo({ method: 'phone', value: '' })}
        >
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 font-bold text-xl mb-6 mx-auto">
            PHONE
          </div>
          <h3 className="text-xl font-bold text-center mb-4">Enter Phone</h3>
          <p className="text-gray-600 text-center text-sm">
            Enter the receiver's phone number for SMS notification
          </p>
        </div>
      </div>
      
      {/* Input based on selected method */}
      {receiverInfo.method && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <h3 className="text-xl font-bold mb-6 text-center">
            {receiverInfo.method === 'qr' ? 'Scan QR Code' :
             receiverInfo.method === 'email' ? 'Enter Email Address' :
             'Enter Phone Number'}
          </h3>
          
          {receiverInfo.method === 'qr' && (
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📷</div>
                  <p>Camera Scanner</p>
                  <p className="text-sm">Position QR code in frame</p>
                </div>
              </div>
              <button 
                onClick={() => setReceiverInfo({ ...receiverInfo, value: 'DEMO_QR_SCANNED' })}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                📱 Open Camera Scanner
              </button>
            </div>
          )}
          
          {receiverInfo.method === 'email' && (
            <div className="max-w-md mx-auto">
              <input
                type="email"
                placeholder="receiver@example.com"
                value={receiverInfo.value}
                onChange={(e) => setReceiverInfo({ ...receiverInfo, value: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              />
              <input
                type="text"
                placeholder="Receiver's Name (optional)"
                value={receiverInfo.name || ''}
                onChange={(e) => setReceiverInfo({ ...receiverInfo, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          )}
          
          {receiverInfo.method === 'phone' && (
            <div className="max-w-md mx-auto">
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={receiverInfo.value}
                onChange={(e) => setReceiverInfo({ ...receiverInfo, value: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              />
              <input
                type="text"
                placeholder="Receiver's Name (optional)"
                value={receiverInfo.name || ''}
                onChange={(e) => setReceiverInfo({ ...receiverInfo, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          )}
        </motion.div>
      )}
      
      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <div className="space-x-4">
          <button
            onClick={() => setCurrentStep('welcome')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            ← Back
          </button>
          <button
            onClick={() => setCurrentStep('upload')}
            disabled={!receiverInfo.method || (receiverInfo.method !== 'qr' && !receiverInfo.value)}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            Continue to Upload Documents →
          </button>
        </div>
        
        {receiverInfo.method && receiverInfo.value && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-green-800 text-sm">
              ✅ Receiver identified: {receiverInfo.value}
              {receiverInfo.name && ` (${receiverInfo.name})`}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderSetPermissionsStep = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-6">
          APPROVE
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Set Permissions & Send Access
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Configure what {receiverInfo.name || 'the receiver'} can do with your documents
        </p>
        
        {/* Receiver Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-blue-800 font-medium">
            📧 Sending to: {receiverInfo.value}
            {receiverInfo.name && ` (${receiverInfo.name})`}
          </p>
        </div>
      </div>
      
      {/* Documents Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Documents to Share ({uploadedDocs.length})</h3>
        <div className="space-y-3">
          {uploadedDocs.map((doc) => (
            <div key={doc.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={permissions.selectedDocuments.includes(doc.id)}
                onChange={(e) => {
                  const updatedDocs = e.target.checked
                    ? [...permissions.selectedDocuments, doc.id]
                    : permissions.selectedDocuments.filter(id => id !== doc.id);
                  setPermissions({ ...permissions, selectedDocuments: updatedDocs });
                }}
                className="mr-3 w-4 h-4 text-blue-600"
              />
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm mr-3">
                DOC
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{doc.name}</h4>
                <p className="text-sm text-gray-600">{doc.type} • {(doc.size / 1024).toFixed(1)} KB</p>
              </div>
              {doc.sensitive && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                  Sensitive
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Permissions Settings */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Access Permissions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Access Permissions</h3>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={permissions.canView}
                onChange={(e) => setPermissions({ ...permissions, canView: e.target.checked })}
                className="mr-3 w-4 h-4 text-blue-600"
              />
              <div>
                <span className="font-medium">Can View Documents</span>
                <p className="text-sm text-gray-600">Allow receiver to view document contents</p>
              </div>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={permissions.canPrint}
                onChange={(e) => setPermissions({ ...permissions, canPrint: e.target.checked })}
                className="mr-3 w-4 h-4 text-blue-600"
              />
              <div>
                <span className="font-medium">Can Print Documents</span>
                <p className="text-sm text-gray-600">Allow receiver to print documents at café</p>
              </div>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={permissions.canDownload}
                onChange={(e) => setPermissions({ ...permissions, canDownload: e.target.checked })}
                className="mr-3 w-4 h-4 text-blue-600"
                disabled
              />
              <div>
                <span className="font-medium text-gray-400">Can Download (Disabled)</span>
                <p className="text-sm text-gray-400">Downloads are disabled for security</p>
              </div>
            </label>
          </div>
        </div>
        
        {/* Time Limits */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Access Duration</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <select
                value={permissions.timeLimit}
                onChange={(e) => setPermissions({ ...permissions, timeLimit: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
                <option value={240}>4 hours</option>
                <option value={1440}>24 hours</option>
              </select>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-800 text-sm">
                ⏱️ Access will expire automatically after {permissions.timeLimit} minutes
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Consent Approval */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Ready to Send Access?
        </h3>
        
        <div className="text-center mb-6">
          <p className="text-gray-700 mb-4">
            You're about to grant access to <strong>{permissions.selectedDocuments.length}</strong> document(s) 
            to <strong>{receiverInfo.value}</strong> for <strong>{permissions.timeLimit} minutes</strong>.
          </p>
          
          <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
            <h4 className="font-semibold mb-2">Permissions Summary:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Can View: {permissions.canView ? 'Yes' : 'No'}</li>
              <li>🖨️ Can Print: {permissions.canPrint ? 'Yes' : 'No'}</li>
              <li>⏱️ Duration: {permissions.timeLimit} minutes</li>
              <li>📄 Documents: {permissions.selectedDocuments.length}</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => {
              // Here we would send the actual consent/access
              alert(`Access sent to ${receiverInfo.value}!\n\nThey will receive a notification with instant access to your documents.\n\nAccess expires in ${permissions.timeLimit} minutes.`);
              
              // Store the sharing info for receiver to access
              const shareData = {
                shareId: Math.random().toString(36).substr(2, 9),
                receiverInfo,
                documents: uploadedDocs.filter(doc => permissions.selectedDocuments.includes(doc.id)),
                permissions,
                timestamp: new Date().toISOString(),
                expiresAt: new Date(Date.now() + permissions.timeLimit * 60 * 1000).toISOString()
              };
              
              // Store in localStorage for demo (in production, this would be sent to receiver via SMS/email)
              localStorage.setItem('shared_documents', JSON.stringify(shareData));
              
              setCurrentStep('approve-consent');
            }}
            disabled={permissions.selectedDocuments.length === 0 || !permissions.canView}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            📤 Send Access to Receiver
          </button>
          
          {permissions.selectedDocuments.length === 0 && (
            <p className="text-red-600 text-sm mt-2">Please select at least one document</p>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <div className="space-x-4">
          <button
            onClick={() => setCurrentStep('upload')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            ← Back to Upload
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === step.id 
                    ? 'bg-blue-500 text-white' 
                    : index < steps.findIndex(s => s.id === currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.icon}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep === step.id ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    index < steps.findIndex(s => s.id === currentStep) ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        {currentStep === 'welcome' && renderWelcomeStep()}
        {currentStep === 'identify-receiver' && renderIdentifyReceiverStep()}
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'set-permissions' && renderSetPermissionsStep()}
        {currentStep === 'approve-consent' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-8">
              ✓
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Documents Sent Successfully!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Access has been sent to {receiverInfo.value}
              {receiverInfo.name && ` (${receiverInfo.name})`}
            </p>
            
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-6">Sharing Summary</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Recipient Details</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-800">
                      📧 {receiverInfo.value}
                      {receiverInfo.name && <br />}<span className="font-medium">{receiverInfo.name}</span>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Access Details</h4>
                  <div className="bg-green-50 rounded-lg p-4 text-sm">
                    <p className="text-green-800">📄 Documents: {permissions.selectedDocuments.length}</p>
                    <p className="text-green-800">⏱️ Duration: {permissions.timeLimit} minutes</p>
                    <p className="text-green-800">👀 Can View: {permissions.canView ? 'Yes' : 'No'}</p>
                    <p className="text-green-800">🖨️ Can Print: {permissions.canPrint ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  📱 The receiver has been notified and can access documents immediately.
                  Access will expire automatically in {permissions.timeLimit} minutes.
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-x-4">
                <button
                  onClick={() => {
                    // Reset everything for new sharing
                    setCurrentStep('welcome');
                    setUploadedDocs([]);
                    setReceiverInfo({ method: null, value: '' });
                    setPermissions({
                      canView: true,
                      canPrint: true,
                      canDownload: false,
                      timeLimit: 30,
                      selectedDocuments: []
                    });
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Share More Documents
                </button>
                
                <Link
                  to="/"
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Back to Home
                </Link>
              </div>
              
              <p className="text-sm text-gray-500">
                You can track document access and activities in your dashboard.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SenderPage;