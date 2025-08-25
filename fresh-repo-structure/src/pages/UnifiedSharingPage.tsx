import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

interface RecipientMethod {
  id: 'qr' | 'email' | 'phone' | 'id';
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  ipfsHash?: string;
}

const UnifiedSharingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'choose-method' | 'enter-details' | 'upload-docs' | 'set-permissions' | 'confirm'>('choose-method');
  const [selectedMethod, setSelectedMethod] = useState<RecipientMethod | null>(null);
  const [recipientDetails, setRecipientDetails] = useState({ value: '', name: '' });
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([]);
  const [permissions, setPermissions] = useState({
    canView: true,
    canPrint: true,
    timeLimit: 30,
    selectedDocuments: [] as string[]
  });

  const methods: RecipientMethod[] = [
    {
      id: 'id',
      title: 'CipherDocs ID',
      description: 'Send using recipient\'s unique CipherDocs ID',
      icon: 'ID',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'qr',
      title: 'QR Code Scan',
      description: 'Scan recipient\'s QR code from their CipherDocs app',
      icon: 'QR',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'email',
      title: 'Email Address',
      description: 'Send to recipient\'s registered email address',
      icon: '@',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'phone',
      title: 'Phone Number',
      description: 'Send to recipient\'s registered phone number',
      icon: 'TEL',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleMethodSelect = (method: RecipientMethod) => {
    setSelectedMethod(method);
    setCurrentStep('enter-details');
  };

  const handleDetailsNext = () => {
    if (recipientDetails.value.trim()) {
      setCurrentStep('upload-docs');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocs: Document[] = Array.from(files).map((file, index) => ({
        id: `doc_${Date.now()}_${index}`,
        name: file.name,
        type: file.type,
        size: file.size,
        ipfsHash: `placeholder_hash_${Date.now()}_${index}`
      }));
      
      setUploadedDocs(newDocs);
      setPermissions(prev => ({
        ...prev,
        selectedDocuments: newDocs.map(doc => doc.id)
      }));
      setCurrentStep('set-permissions');
      toast.success(`${newDocs.length} document(s) uploaded successfully!`);
    }
  };

  const handleShare = () => {
    const shareData = {
      shareId: `share_${Date.now()}`,
      receiverInfo: {
        method: selectedMethod?.id,
        value: recipientDetails.value,
        name: recipientDetails.name
      },
      documents: uploadedDocs.filter(doc => permissions.selectedDocuments.includes(doc.id)),
      permissions,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + permissions.timeLimit * 60 * 1000).toISOString(),
      location: 'Pune, Maharashtra'
    };

    localStorage.setItem('shared_documents', JSON.stringify(shareData));
    setCurrentStep('confirm');
    toast.success('Documents shared successfully!');
  };

  const renderChooseMethod = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm mx-auto mb-8">
        SHARE
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Share Documents Securely</h1>
      <p className="text-xl text-gray-600 mb-12">Choose how you want to send documents - all methods in one place!</p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {methods.map((method) => (
          <motion.div
            key={method.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMethodSelect(method)}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer p-8 border-2 border-transparent hover:border-blue-500"
          >
            <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-6 mx-auto`}>
              {method.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{method.title}</h3>
            <p className="text-gray-600 text-sm">{method.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderEnterDetails = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 bg-gradient-to-r ${selectedMethod?.color} rounded-2xl flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4`}>
            {selectedMethod?.icon}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Enter {selectedMethod?.title} Details</h2>
          <p className="text-gray-600">{selectedMethod?.description}</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {selectedMethod?.id === 'email' ? 'Email Address' : 
               selectedMethod?.id === 'phone' ? 'Phone Number' :
               selectedMethod?.id === 'id' ? 'CipherDocs ID' : 'QR Code Data'}
            </label>
            <input
              type={selectedMethod?.id === 'email' ? 'email' : 'text'}
              value={recipientDetails.value}
              onChange={(e) => setRecipientDetails({...recipientDetails, value: e.target.value})}
              placeholder={selectedMethod?.id === 'email' ? 'recipient@example.com' : 
                          selectedMethod?.id === 'phone' ? '+91 9876543210' :
                          selectedMethod?.id === 'id' ? 'CD123456789' : 'Scan QR code...'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Name (Optional)
            </label>
            <input
              type="text"
              value={recipientDetails.name}
              onChange={(e) => setRecipientDetails({...recipientDetails, name: e.target.value})}
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentStep('choose-method')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              ← Back
            </button>
            <button
              onClick={handleDetailsNext}
              disabled={!recipientDetails.value.trim()}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderUploadDocs = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Upload Documents</h2>
        <p className="text-xl text-gray-600">
          Sharing with: {recipientDetails.value} {recipientDetails.name && `(${recipientDetails.name})`}
        </p>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-blue-600 font-bold">DOC</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Documents</h3>
          <p className="text-gray-600 mb-6">Choose files to share securely</p>
          
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="btn-primary cursor-pointer inline-block"
          >
            Choose Files
          </label>
        </div>
        
        <div className="flex space-x-4 mt-8">
          <button
            onClick={() => setCurrentStep('enter-details')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderSetPermissions = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Set Permissions</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Access Permissions</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.canView}
                  onChange={(e) => setPermissions({...permissions, canView: e.target.checked})}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                <span className="font-medium">Can View Documents</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permissions.canPrint}
                  onChange={(e) => setPermissions({...permissions, canPrint: e.target.checked})}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                <span className="font-medium">Can Print Documents</span>
              </label>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Time Limit</h3>
            <select
              value={permissions.timeLimit}
              onChange={(e) => setPermissions({...permissions, timeLimit: parseInt(e.target.value)})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Documents to Share ({uploadedDocs.length})</h3>
          <div className="space-y-2">
            {uploadedDocs.map((doc) => (
              <div key={doc.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-blue-600 mr-3">DOC</span>
                <span className="flex-1">{doc.name}</span>
                <span className="text-sm text-gray-500">{(doc.size / 1024).toFixed(1)} KB</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-4 mt-8">
          <button
            onClick={() => setCurrentStep('upload-docs')}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
          <button
            onClick={handleShare}
            className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Share Documents →
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderConfirm = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-lg font-bold mx-auto mb-6">
          OK
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Documents Shared Successfully!</h2>
        <p className="text-gray-600 mb-8">
          {uploadedDocs.length} document(s) have been shared with {recipientDetails.value}
        </p>
        
        <div className="space-y-4">
          <Link
            to="/receiver"
            className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            View as Recipient
          </Link>
          <button
            onClick={() => {
              setCurrentStep('choose-method');
              setSelectedMethod(null);
              setRecipientDetails({ value: '', name: '' });
              setUploadedDocs([]);
            }}
            className="block w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Share More Documents
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xs mr-4">
                CD
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CipherDocs - Unified Sharing</h1>
                <p className="text-gray-600">All sharing methods in one place - Pune, Maharashtra</p>
              </div>
            </div>
            <Link to="/" className="text-gray-600 hover:text-gray-800 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {currentStep === 'choose-method' && renderChooseMethod()}
        {currentStep === 'enter-details' && renderEnterDetails()}
        {currentStep === 'upload-docs' && renderUploadDocs()}
        {currentStep === 'set-permissions' && renderSetPermissions()}
        {currentStep === 'confirm' && renderConfirm()}
      </div>
    </div>
  );
};

export default UnifiedSharingPage;