import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { uploadToIPFS } from '../services/ipfsService';
import SafeStorage from '../utils/safeStorage';

interface Document {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  sensitive: boolean;
  ipfsHash: string;
  size: number;
  uploadedAt: Date;
}

interface DocumentUploadProps {
  onDocumentsUploaded: (documents: Document[]) => void;
  onBack: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onDocumentsUploaded, onBack }) => {
  const [uploadedDocuments, setUploadedDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const documentTypes = [
    { id: 'identity', name: 'Identity Document', icon: 'ID', sensitive: true },
    { id: 'tax', name: 'Tax Document', icon: '💳', sensitive: true },
    { id: 'academic', name: 'Academic Certificate', icon: '🎓', sensitive: false },
    { id: 'financial', name: 'Financial Document', icon: '🏦', sensitive: true },
    { id: 'photo', name: 'Photo', icon: '📸', sensitive: false },
    { id: 'other', name: 'Other Document', icon: 'DOC', sensitive: false }
  ];

  const handleFileUpload = async (file: File, documentType: any) => {
    if (!file) return;

    setUploading(true);
    const fileId = Math.random().toString(36).substr(2, 9);
    
    try {
      // Show upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      // Simulate progress for demo
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const currentProgress = prev[fileId] || 0;
          if (currentProgress < 90) {
            return { ...prev, [fileId]: currentProgress + 10 };
          }
          return prev;
        });
      }, 200);

      // Upload to IPFS
      const ipfsHash = await uploadToIPFS(file);
      
      clearInterval(progressInterval);
      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));

      // Create document object
      const newDocument: Document = {
        id: fileId,
        name: file.name.split('.')[0],
        type: documentType.name,
        icon: documentType.icon,
        description: `${documentType.name} - ${file.name}`,
        sensitive: documentType.sensitive,
        ipfsHash,
        size: file.size,
        uploadedAt: new Date()
      };

      setUploadedDocuments(prev => [...prev, newDocument]);
      
      // Remove progress tracking
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }, 1000);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = (docId: string) => {
    setUploadedDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const handleProceed = () => {
    if (uploadedDocuments.length === 0) {
      alert('Please upload at least one document');
      return;
    }
    
    // Store documents using SafeStorage to handle quota issues
    const saved = SafeStorage.setItem('user_documents', uploadedDocuments);
    if (saved) {
      console.log(`Saved ${uploadedDocuments.length} documents to storage`);
      onDocumentsUploaded(uploadedDocuments);
    } else {
      alert('Failed to save documents to storage. Please try again or clear browser data.');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg border"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Upload Your Documents</h3>
        <p className="text-gray-600">
          Upload your documents securely to IPFS. These will be available for sharing at cafés.
        </p>
      </div>

      {/* Upload Sections */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {documentTypes.map((docType) => (
          <div key={docType.id} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
            <div className="text-3xl mb-2">{docType.icon}</div>
            <h4 className="font-medium text-gray-800 mb-2">{docType.name}</h4>
            <p className={`text-xs mb-3 ${docType.sensitive ? 'text-red-500' : 'text-green-500'}`}>
              {docType.sensitive ? 'Sensitive' : 'General'}
            </p>
            <input
              type="file"
              id={`upload-${docType.id}`}
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file, docType);
              }}
              disabled={uploading}
            />
            <label
              htmlFor={`upload-${docType.id}`}
              className={`inline-block px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${
                uploading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {uploading ? 'Uploading...' : 'Choose File'}
            </label>
          </div>
        ))}
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Upload Progress</h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="mb-2">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Uploading to IPFS...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Documents */}
      {uploadedDocuments.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-800 mb-3">Uploaded Documents ({uploadedDocuments.length})</h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {uploadedDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{doc.icon}</span>
                  <div>
                    <h5 className="font-medium text-gray-800">{doc.name}</h5>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{formatFileSize(doc.size)}</span>
                      <span>•</span>
                      <span>IPFS: {doc.ipfsHash.slice(0, 8)}...</span>
                      {doc.sensitive && (
                        <>
                          <span>•</span>
                          <span className="text-red-500">Sensitive</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove document"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleProceed}
          disabled={uploadedDocuments.length === 0}
          className={`flex-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
            uploadedDocuments.length > 0
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue with {uploadedDocuments.length} Document(s) →
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Supported formats: PDF, JPG, PNG, DOC, DOCX • Max size: 10MB per file
      </p>
    </motion.div>
  );
};

export default DocumentUpload;