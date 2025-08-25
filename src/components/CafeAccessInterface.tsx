import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SecureDocumentViewer from './SecureDocumentViewer';
import AuditStorageManager from '../utils/auditStorageManager';
import { printManager, PrintJob, PrintableDocument } from '../utils/printUtils';

interface SharedDocument {
  id: string;
  name: string;
  type: string;
  icon: string;
  description: string;
  sensitive: boolean;
  ipfsHash?: string;
  size?: number;
  expiresAt: Date;
}

interface CafeAccessInterface {
  sharedDocuments: SharedDocument[];
  accessCode: string;
  timeRemaining: number;
  cafeName?: string;
  onView: (docId: string) => void;
  onShowAudit: () => void;
  onTransactionComplete?: () => void;
}

const CafeAccessInterface: React.FC<CafeAccessInterface> = ({
  sharedDocuments,
  accessCode,
  timeRemaining,
  cafeName = 'Internet Café',
  onView,
  onShowAudit,
  onTransactionComplete
}) => {
  const [viewingDocument, setViewingDocument] = useState<SharedDocument | null>(null);
  const [secureViewerOpen, setSecureViewerOpen] = useState(false);
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    // Set up print status monitoring
    printManager.onPrintStatusUpdate((jobs) => {
      setPrintJobs(jobs);
      setIsPrinting(jobs.some(job => job.status === 'printing' || job.status === 'pending'));
    });
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleView = (document: SharedDocument) => {
    // Log audit entry
    logAuditEntry({
      action: 'document_viewed',
      documentName: document.name,
      details: `Document opened in secure viewer - no download access`
    });

    setViewingDocument(document);
    setSecureViewerOpen(true);
    onView(document.id);
  };

  const logAuditEntry = (entry: Partial<any>) => {
    const auditEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      requesterName: cafeName,
      userPhone: '+91-****-**12', // Would come from session
      ipAddress: '192.168.1.100', // Would be detected
      deviceInfo: navigator.userAgent.split(' ')[0],
      accessCode,
      ...entry
    };

    // Use the AuditStorageManager for safer storage
    const success = AuditStorageManager.addEntry(auditEntry);
    
    if (success) {
      console.log('Audit Entry Logged:', auditEntry);
    } else {
      console.log('Audit Entry (Console Only):', auditEntry);
      // In production, this would trigger immediate blockchain submission
    }
  };

  if (timeRemaining <= 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto bg-red-50 p-8 rounded-2xl border border-red-200 text-center"
      >
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-red-800 mb-2">Access Expired</h3>
        <p className="text-red-600">Document access has expired. Please request new access from the user.</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg border"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Café Access Portal</h3>
        <p className="text-gray-600">User has shared {sharedDocuments.length} document(s) with {cafeName}</p>
      </div>

      {/* Access Status */}
      <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-green-800">Access Granted</h4>
            <p className="text-sm text-green-600">Access Code: <span className="font-mono font-bold">{accessCode}</span></p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-green-600">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-green-600">Time Remaining</p>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-gray-800">Available Documents ({sharedDocuments.length})</h4>
        
        {sharedDocuments.map((document) => (
          <motion.div
            key={document.id}
            whileHover={{ scale: 1.02 }}
            className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">{document.icon}</div>
                <div>
                  <h5 className="font-medium text-gray-800">{document.name}</h5>
                  <p className="text-sm text-gray-600">{document.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                    <span>{document.type}</span>
                    {document.size && (
                      <>
                        <span>•</span>
                        <span>{formatFileSize(document.size)}</span>
                      </>
                    )}
                    {document.ipfsHash && (
                      <>
                        <span>•</span>
                        <span>IPFS: {document.ipfsHash.slice(0, 8)}...</span>
                      </>
                    )}
                    {document.sensitive && (
                      <>
                        <span>•</span>
                        <span className="text-red-500">Sensitive</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {document.ipfsHash ? (
                  <>
                    <button
                      onClick={() => handleView(document)}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg font-medium transition-colors"
                      title="View document (secure mode)"
                    >
                      View {document.sensitive ? 'Only' : '& Print'}
                    </button>
                    <div className={`px-3 py-2 text-xs rounded-lg border ${
                      document.sensitive 
                        ? 'bg-red-100 text-red-700 border-red-200' 
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      {document.sensitive ? 'No Print' : 'Printable'}
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-2 bg-gray-200 text-gray-500 text-sm rounded-lg">
                    Demo Document
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Notice */}
      {/* Security Notice */}
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-6">
        <div className="flex items-start space-x-3">
          <span className="text-red-600 text-xl">🚨</span>
          <div>
            <h5 className="font-medium text-red-800">Security Policy</h5>
            <p className="text-sm text-red-700">
              • VIEW-ONLY access for sensitive documents - Downloads DISABLED<br/>
              • SELECTIVE PRINTING: Non-sensitive documents can be printed<br/>
              • All document access and print activities are logged and monitored<br/>
              • Screenshots and printing are tracked via blockchain audit<br/>
              • Violation of terms will result in permanent access revocation
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-start space-x-3">
          <span className="text-yellow-600 text-xl">!</span>
          <div>
            <h5 className="font-medium text-yellow-800">Security Notice</h5>
            <p className="text-sm text-yellow-700">
              • Documents are streamed securely from IPFS<br/>
              • Access automatically expires at {formatTime(timeRemaining)}<br/>
              • All access is logged on blockchain for audit<br/>
              • Do not save or share these documents
            </p>
          </div>
        </div>
      </div>

      {/* Print Status Display */}
      {printJobs.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-800">Print Queue Status</h4>
            <div className="flex space-x-2">
              <button
                onClick={() => printManager.clearCompletedJobs()}
                className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
              >
                Clear Completed
              </button>
              {isPrinting && (
                <button
                  onClick={() => {
                    printManager.cancelAllJobs();
                    setIsPrinting(false);
                  }}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                >
                  Cancel All
                </button>
              )}
            </div>
          </div>
          <div className="space-y-2">
            {printJobs.map((job, index) => (
              <div key={`${job.documentId}-${index}`} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center space-x-2">
                  <span className={`text-lg ${
                    job.status === 'completed' ? '✓' :
                    job.status === 'printing' ? '•' :
                    job.status === 'failed' ? '✗' : '•'
                  }`}></span>
                  <span className="text-sm font-medium">{job.documentName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    job.status === 'completed' ? 'bg-green-100 text-green-700' :
                    job.status === 'printing' ? 'bg-blue-100 text-blue-700' :
                    job.status === 'failed' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {job.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons for Café */}
      <div className="flex space-x-3 mt-6">
        <button
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          onClick={() => {
            logAuditEntry({
              action: 'bulk_document_view',
              documentName: `All Documents (${sharedDocuments.length} files)`,
              details: 'Multiple document viewing initiated in secure mode with selective printing'
            });
            // Show all documents that can be viewed
            const viewableDocuments = sharedDocuments.filter(doc => doc.ipfsHash);
            if (viewableDocuments.length > 0) {
              // Open first document but allow cycling through all
              setViewingDocument(viewableDocuments[0]);
              setSecureViewerOpen(true);
            } else {
              alert('No viewable documents found. Please ensure documents have valid IPFS hashes.');
            }
          }}
        >
          View All Documents ({sharedDocuments.filter(d => d.ipfsHash).length})
        </button>
        <button
          className={`bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors ${
            isPrinting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
          disabled={isPrinting}
          onClick={async () => {
            const printableDocuments = sharedDocuments.filter(doc => !doc.sensitive && doc.ipfsHash);
            if (printableDocuments.length === 0) {
              alert('No printable documents available. All shared documents are marked as sensitive.');
              return;
            }
            
            try {
              setIsPrinting(true);
              
              logAuditEntry({
                action: 'bulk_print_initiated',
                documentName: printableDocuments.map(d => d.name).join(', '),
                details: `Bulk printing initiated for ${printableDocuments.length} printable documents`
              });
              
              // Convert to PrintableDocument format
              const printableDocs: PrintableDocument[] = printableDocuments.map(doc => ({
                id: doc.id,
                name: doc.name,
                ipfsHash: doc.ipfsHash!,
                sensitive: doc.sensitive,
                type: doc.type,
                size: doc.size
              }));
              
              // Use print manager for better handling
              const printResults = await printManager.printMultipleDocuments(
                printableDocs,
                (action, details) => logAuditEntry({ action, documentName: 'Bulk Print', details })
              );
              
              const successful = printResults.filter(job => job.status === 'completed').length;
              const failed = printResults.filter(job => job.status === 'failed').length;
              
              alert(`Bulk Print Complete!\n\nSuccessfully printed: ${successful} documents\n${failed > 0 ? `Failed: ${failed} documents` : ''}\n\n${printResults.map(job => `• ${job.documentName}: ${job.status === 'completed' ? 'Done' : 'Failed'}`).join('\n')}`);
              
            } catch (error) {
              logAuditEntry({
                action: 'bulk_print_error',
                documentName: 'Multiple Documents',
                details: `Bulk print failed: ${error}`
              });
              alert(`Bulk print failed: ${error}`);
            } finally {
              setIsPrinting(false);
            }
          }}
        >
          {isPrinting ? 'Printing...' : `Print All (${sharedDocuments.filter(d => !d.sensitive && d.ipfsHash).length})`}
        </button>
        <button
          onClick={onShowAudit}
          className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
        >
          View Audit Trail
        </button>
        <button
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          onClick={() => {
            logAuditEntry({
              action: 'session_completed',
              documentName: sharedDocuments.map(d => d.name).join(', '),
              details: 'Transaction completed successfully - All files removed from access'
            });
            
            const docList = sharedDocuments.map(d => d.name).join(', ');
            
            // Remove the shared documents from storage and reset access
            localStorage.removeItem('shared_documents');
            localStorage.removeItem('access_granted');
            localStorage.removeItem('access_code');
            
            alert(`Transaction Completed Successfully!\n\nProcessed Documents:\n${sharedDocuments.map(d => `• ${d.name}`).join('\n')}\n\nAccess Code: ${accessCode}\nSession completed\nFiles removed from access\nAll activity logged for audit`);
            
            // Optionally trigger a callback to parent component to reset state
            if (onTransactionComplete) {
              onTransactionComplete();
            }
          }}
        >
          Complete Transaction & Remove Files
        </button>
      </div>
      
      {/* Secure Document Viewer */}
      {secureViewerOpen && viewingDocument && viewingDocument.ipfsHash && (
        <SecureDocumentViewer
          ipfsHash={viewingDocument.ipfsHash}
          documentName={viewingDocument.name}
          isPrintable={!viewingDocument.sensitive} // Allow printing for non-sensitive documents
          documentType={viewingDocument.sensitive ? 'sensitive' : 'printable'}
          onClose={() => {
            setSecureViewerOpen(false);
            setViewingDocument(null);
          }}
          onAuditLog={(action, details) => {
            logAuditEntry({
              action: action as any,
              documentName: viewingDocument.name,
              details
            });
          }}
        />
      )}
    </motion.div>
  );
};

export default CafeAccessInterface;