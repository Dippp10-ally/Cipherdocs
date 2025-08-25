import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// @ts-ignore - Temporary fix for module resolution
import SecureIPFSPrintService from '../services/secureIPFSPrintService';
import AuditStorageManager from '../utils/auditStorageManager';

interface SecurePrintInterfaceProps {
  documents: Array<{
    id: string;
    name: string;
    file?: File;
    ipfsHash?: string;
    printable: boolean;
    sensitive: boolean;
  }>;
  shopId: string;
  userId: string;
  onPrintComplete: (results: any) => void;
  onClose: () => void;
}

interface PrintJob {
  jobId: string;
  documentName: string;
  status: 'pending' | 'dispatched' | 'printed' | 'failed';
  previewUrl?: string;
  createdAt: Date;
}

const SecurePrintInterface: React.FC<SecurePrintInterfaceProps> = ({
  documents,
  shopId,
  userId,
  onPrintComplete,
  onClose
}) => {
  const [printJobs, setPrintJobs] = useState<PrintJob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [printResults, setPrintResults] = useState<any[]>([]);

  useEffect(() => {
    // Register shop agent on mount (mock for demo)
    SecureIPFSPrintService.registerAgent(shopId, `pubkey_${shopId}`, {
      model: 'HP LaserJet Pro 400',
      driver: 'CUPS',
      capabilities: ['duplex', 'color', 'a4', 'letter']
    });

    // Cleanup expired jobs
    SecureIPFSPrintService.cleanupExpiredJobs();
  }, [shopId]);

  const printableDocuments = documents.filter(doc => doc.printable && !doc.sensitive);
  const blockedDocuments = documents.filter(doc => !doc.printable || doc.sensitive);

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleSecurePrint = async () => {
    if (selectedDocuments.length === 0) {
      alert('Please select documents to print');
      return;
    }

    setIsProcessing(true);
    const results: any[] = [];

    try {
      // Log critical event - print attempt started
      AuditStorageManager.addCriticalEvent('secure_print_started', {
        documentCount: selectedDocuments.length,
        shopId,
        userId,
        documentIds: selectedDocuments
      });

      for (const docId of selectedDocuments) {
        const document = documents.find(d => d.id === docId);
        if (!document) continue;

        // Check if document is actually printable
        if (!document.printable || document.sensitive) {
          // Log critical security violation
          AuditStorageManager.addCriticalEvent('print_attempt_blocked', {
            documentId: docId,
            documentName: document.name,
            reason: document.sensitive ? 'sensitive_document' : 'not_printable',
            shopId,
            userId
          });

          results.push({
            documentId: docId,
            success: false,
            error: 'Document not authorized for printing'
          });
          continue;
        }

        try {
          // Create a mock file if we only have IPFS hash
          let fileToUpload: File;
          if (document.file) {
            fileToUpload = document.file;
          } else {
            // In production, fetch from IPFS and create File object
            const mockContent = `Mock content for ${document.name}`;
            fileToUpload = new File([mockContent], document.name, { type: 'application/pdf' });
          }

          // Upload for secure printing with encryption
          const uploadResult = await SecureIPFSPrintService.uploadForSecurePrint(
            fileToUpload,
            userId,
            shopId,
            {
              duplex: false,
              copies: 1,
              quality: 'normal'
            }
          );

          if (uploadResult.success) {
            // Dispatch to agent immediately
            const dispatchResult = await SecureIPFSPrintService.dispatchPrintJob(uploadResult.jobId);
            
            if (dispatchResult.success) {
              // Log successful print dispatch
              AuditStorageManager.addCriticalEvent('document_printed', {
                documentId: docId,
                documentName: document.name,
                jobId: uploadResult.jobId,
                shopId,
                userId,
                method: 'secure_ipfs_agent'
              });

              const newJob: PrintJob = {
                jobId: uploadResult.jobId,
                documentName: document.name,
                status: 'dispatched',
                previewUrl: uploadResult.previewUrl,
                createdAt: new Date()
              };

              setPrintJobs(prev => [...prev, newJob]);

              results.push({
                documentId: docId,
                success: true,
                jobId: uploadResult.jobId,
                previewUrl: uploadResult.previewUrl
              });
            } else {
              throw new Error(dispatchResult.error || 'Failed to dispatch print job');
            }
          } else {
            throw new Error(uploadResult.error || 'Failed to upload for secure printing');
          }
        } catch (error) {
          console.error(`Failed to print document ${document.name}:`, error);
          
          // Log failed print attempt (critical)
          AuditStorageManager.addCriticalEvent('print_failed', {
            documentId: docId,
            documentName: document.name,
            error: error instanceof Error ? error.message : 'Unknown error',
            shopId,
            userId
          });

          results.push({
            documentId: docId,
            success: false,
            error: error instanceof Error ? error.message : 'Print failed'
          });
        }
      }

      setPrintResults(results);
      
      // Log overall completion
      const successCount = results.filter(r => r.success).length;
      AuditStorageManager.addCriticalEvent('secure_print_completed', {
        totalDocuments: selectedDocuments.length,
        successfulPrints: successCount,
        failedPrints: results.length - successCount,
        shopId,
        userId
      });

    } catch (error) {
      console.error('Secure print process failed:', error);
      
      AuditStorageManager.addCriticalEvent('secure_print_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        shopId,
        userId
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewPreview = (previewUrl: string, documentName: string) => {
    // Open watermarked preview in new window
    const previewWindow = window.open('', '_blank', 'width=600,height=800,scrollbars=yes');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Secure Preview - ${documentName}</title>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: Arial, sans-serif;
              text-align: center;
              background: #f8f9fa;
            }
            .warning {
              background: #fff3cd;
              border: 2px solid #ffeaa7;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              color: #856404;
            }
            img {
              max-width: 100%;
              border: 2px solid #dee2e6;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="warning">
            ⚠️ <strong>PREVIEW ONLY</strong><br>
            This is a low-resolution watermarked preview.<br>
            Original document is encrypted and stored securely.
          </div>
          <h3>📄 ${documentName}</h3>
          <img src="${previewUrl}" alt="Document Preview" />
          <p><small>Generated: ${new Date().toLocaleString()}</small></p>
        </body>
        </html>
      `);
    }
  };

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🔒 Secure IPFS Printing</h2>
        <p className="text-gray-600">Encrypted files • Agent-based printing • Watermarked previews</p>
      </div>

      {/* Security Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">🛡️ How Secure Printing Works:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Files encrypted with AES-256-GCM before IPFS upload</li>
          <li>• Only authorized print agent can decrypt files</li>
          <li>• Browser shows watermarked preview only</li>
          <li>• Agent prints and securely wipes temporary files</li>
          <li>• All actions logged with blockchain-ready audit trail</li>
        </ul>
      </div>

      {/* Printable Documents */}
      {printableDocuments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            ✅ Printable Documents ({printableDocuments.length})
          </h3>
          <div className="space-y-3">
            {printableDocuments.map((doc) => (
              <div 
                key={doc.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedDocuments.includes(doc.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => handleDocumentSelect(doc.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6">
                      {selectedDocuments.includes(doc.id) ? (
                        <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{doc.name}</h4>
                      <div className="flex items-center space-x-2 text-sm">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                          🖨️ Printable
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          🔒 Encrypted
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blocked Documents */}
      {blockedDocuments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-600 mb-3">
            ❌ Print Blocked ({blockedDocuments.length})
          </h3>
          <div className="space-y-3">
            {blockedDocuments.map((doc) => (
              <div key={doc.id} className="border border-red-200 bg-red-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{doc.name}</h4>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                        {doc.sensitive ? '🔒 Sensitive' : '🚫 Not Printable'}
                      </span>
                      <span className="text-red-600">
                        {doc.sensitive ? 'Contains sensitive information' : 'View-only document'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Print Jobs Status */}
      {printJobs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📋 Print Jobs Status</h3>
          <div className="space-y-2">
            {printJobs.map((job) => (
              <div key={job.jobId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-medium">{job.documentName}</span>
                  <span className="text-sm text-gray-600 ml-2">Job: {job.jobId.slice(-8)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {job.status === 'dispatched' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      🖨️ Printing...
                    </span>
                  )}
                  {job.status === 'printed' && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      ✅ Printed
                    </span>
                  )}
                  {job.previewUrl && (
                    <button
                      onClick={() => handleViewPreview(job.previewUrl!, job.documentName)}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-xs hover:bg-purple-200"
                    >
                      👁️ Preview
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={onClose}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleSecurePrint}
          disabled={selectedDocuments.length === 0 || isProcessing}
          className={`flex-2 py-3 px-4 rounded-lg font-semibold transition-colors ${
            selectedDocuments.length > 0 && !isProcessing
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            '🔄 Processing Secure Print...'
          ) : (
            `🖨️ Print ${selectedDocuments.length} Document(s) Securely`
          )}
        </button>
      </div>

      {/* Results */}
      {printResults.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">📊 Print Results:</h3>
          <div className="space-y-2">
            {printResults.map((result, index) => (
              <div key={index} className={`p-2 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <span className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.success ? '✅' : '❌'} Document {index + 1}: {result.success ? 'Sent to printer' : result.error}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center mt-4">
        🔒 All files encrypted • 👁️ Previews watermarked • 🖨️ Agent-based printing • 📋 Blockchain audit ready
      </p>
    </motion.div>
  );
};

export default SecurePrintInterface;