import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Document {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  sensitive: boolean;
}

interface DocumentSelectorProps {
  onDocumentsSelected: (documents: Document[], duration: number) => void;
  onCancel: () => void;
  requesterName: string;
}

const DocumentSelector: React.FC<DocumentSelectorProps> = ({ 
  onDocumentsSelected, 
  onCancel, 
  requesterName 
}) => {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [duration, setDuration] = useState(15); // Default 15 minutes
  const [userDocuments, setUserDocuments] = useState<Document[]>([]);

  // Load user's uploaded documents from localStorage
  React.useEffect(() => {
    const storedDocs = localStorage.getItem('user_documents');
    if (storedDocs) {
      setUserDocuments(JSON.parse(storedDocs));
    } else {
      // If no documents uploaded, show mock documents for demo
      setUserDocuments([
        {
          id: '1',
          name: 'Aadhaar Card',
          type: 'Identity',
          icon: 'ID',
          description: 'Government ID with photo',
          sensitive: true
        },
        {
          id: '2', 
          name: 'PAN Card',
          type: 'Tax ID',
          icon: '💳',
          description: 'Tax identification number',
          sensitive: true
        },
        {
          id: '3',
          name: 'Resume',
          type: 'Document',
          icon: 'DOC',
          description: 'Professional resume',
          sensitive: false
        }
      ]);
    }
  }, []);

  const toggleDocumentSelection = (document: Document) => {
    setSelectedDocuments(prev => {
      const isSelected = prev.find(doc => doc.id === document.id);
      if (isSelected) {
        return prev.filter(doc => doc.id !== document.id);
      } else {
        return [...prev, document];
      }
    });
  };

  const handleProceed = () => {
    if (selectedDocuments.length === 0) {
      alert('Please select at least one document');
      return;
    }
    onDocumentsSelected(selectedDocuments, duration);
  };

  const getSensitivityColor = (sensitive: boolean) => {
    return sensitive ? 'text-red-500' : 'text-green-500';
  };

  const getSensitivityText = (sensitive: boolean) => {
    return sensitive ? 'Sensitive' : 'General';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Select Documents</h3>
        <p className="text-gray-600 mb-2">
          <span className="font-medium">{requesterName}</span> wants to access your documents
        </p>
        <p className="text-sm text-gray-500">
          Choose which documents you want to share (for printing, scanning, form-filling, etc.)
        </p>
      </div>

      {/* Duration Selector */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Access Duration
        </label>
        <div className="flex gap-2">
          {[5, 10, 15, 30].map((mins) => (
            <button
              key={mins}
              onClick={() => setDuration(mins)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                duration === mins
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {mins} min
            </button>
          ))}
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
      {userDocuments.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">📁</div>
          <h4 className="text-lg font-medium text-gray-800 mb-2">No Documents Found</h4>
          <p className="text-gray-600 mb-4">Please upload your documents first to share them.</p>
          <button
            onClick={onCancel}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            Go Back to Upload
          </button>
        </div>
      ) : (
        userDocuments.map((document) => {
          const isSelected = selectedDocuments.find(doc => doc.id === document.id);
          
          return (
            <motion.div
              key={document.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleDocumentSelection(document)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{document.icon}</div>
                  <div>
                    <h4 className="font-medium text-gray-800">{document.name}</h4>
                    <p className="text-sm text-gray-600">{document.description}</p>
                    <p className={`text-xs ${getSensitivityColor(document.sensitive)}`}>
                      {getSensitivityText(document.sensitive)}
                    </p>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })
      )}
      </div>

      {/* Selected Documents Summary */}
      {selectedDocuments.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">
            Selected Documents ({selectedDocuments.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedDocuments.map((doc) => (
              <span
                key={doc.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
              >
                {doc.icon} {doc.name}
              </span>
            ))}
          </div>
          <p className="text-sm text-green-600 mt-2">
            Access will expire in {duration} minutes
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleProceed}
          disabled={selectedDocuments.length === 0}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
            selectedDocuments.length > 0
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Proceed ({selectedDocuments.length})
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        You have full control over your document access
      </p>
    </motion.div>
  );
};

export default DocumentSelector;