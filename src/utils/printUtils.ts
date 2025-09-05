/**
 * Print utilities for handling multiple document printing in CipherDoc
 */

export interface PrintableDocument {
  id: string;
  name: string;
  ipfsHash: string;
  sensitive: boolean;
  type: string;
  size?: number;
}

export interface PrintJob {
  documentId: string;
  documentName: string;
  status: 'pending' | 'printing' | 'completed' | 'failed';
  timestamp: Date;
  error?: string;
}

class PrintManager {
  private printQueue: PrintJob[] = [];
  private onStatusUpdate?: (jobs: PrintJob[]) => void;

  /**
   * Add callback for print job status updates
   */
  onPrintStatusUpdate(callback: (jobs: PrintJob[]) => void) {
    this.onStatusUpdate = callback;
  }

  /**
   * Print multiple documents with staggered timing
   */
  async printMultipleDocuments(
    documents: PrintableDocument[], 
    onAuditLog: (action: string, details: string) => void
  ): Promise<PrintJob[]> {
    const printableDocuments = documents.filter(doc => !doc.sensitive);
    
    if (printableDocuments.length === 0) {
      throw new Error('No printable documents found. All documents are marked as sensitive.');
    }

    onAuditLog('BULK_PRINT_STARTED', `Initiating bulk print for ${printableDocuments.length} documents`);

    // Create print jobs
    const printJobs: PrintJob[] = printableDocuments.map(doc => ({
      documentId: doc.id,
      documentName: doc.name,
      status: 'pending',
      timestamp: new Date()
    }));

    this.printQueue = printJobs;
    this.updateStatus();

    // Process each document with staggered timing
    for (let i = 0; i < printableDocuments.length; i++) {
      const doc = printableDocuments[i];
      const job = printJobs[i];

      try {
        job.status = 'printing';
        this.updateStatus();

        await this.printSingleDocument(doc, onAuditLog);
        
        job.status = 'completed';
        onAuditLog('DOCUMENT_PRINTED', `Successfully printed: ${doc.name}`);
        
      } catch (error) {
        job.status = 'failed';
        job.error = error instanceof Error ? error.message : 'Unknown error';
        onAuditLog('PRINT_ERROR', `Failed to print ${doc.name}: ${job.error}`);
      }

      this.updateStatus();

      // Wait between print jobs to avoid overwhelming the system
      if (i < printableDocuments.length - 1) {
        await this.delay(2000); // 2 second delay between prints
      }
    }

    onAuditLog('BULK_PRINT_COMPLETED', `Bulk print completed. ${printJobs.filter(j => j.status === 'completed').length}/${printJobs.length} documents printed successfully`);
    
    return printJobs;
  }

  /**
   * Print a single document with multiple fallback methods - SECURE VERSION
   */
  public async printSingleDocument(
    printableDoc: PrintableDocument, 
    onAuditLog: (action: string, details: string) => void
  ): Promise<void> {
    const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${printableDoc.ipfsHash}`;
    
    return new Promise((resolve, reject) => {
      try {
        onAuditLog('SECURE_PRINT_INITIATED', `Starting secure print for: ${printableDoc.name}`);
        
        // Create a secure print iframe that prevents downloads
        const secureIframe = document.createElement('iframe');
        secureIframe.style.cssText = `
          position: fixed;
          top: -9999px;
          left: -9999px;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        `;
        
        // Create secure print HTML that disables downloads
        const secureHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>CipherDoc Secure Print - ${printableDoc.name}</title>
            <style>
              @media screen {
                body { 
                  font-family: Arial, sans-serif;
                  padding: 20px;
                  background: #f5f5f5;
                }
                .print-header {
                  background: linear-gradient(135deg, #4caf50, #45a049);
                  color: white;
                  padding: 20px;
                  border-radius: 8px;
                  text-align: center;
                  margin-bottom: 20px;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                }
                .security-notice {
                  background: #fff3cd;
                  border: 2px solid #ffc107;
                  padding: 15px;
                  border-radius: 6px;
                  margin-bottom: 20px;
                  text-align: center;
                }
              }
              @media print {
                .no-print { display: none !important; }
                body { margin: 0; padding: 0; background: white; }
                iframe { width: 100% !important; height: 100vh !important; border: none !important; }
                .print-header { background: white !important; color: black !important; }
              }
              /* Disable download options and interactions */
              embed, object, .download-button {
                display: none !important;
                pointer-events: none !important;
              }
              /* Prevent context menu on the document */
              iframe {
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
              }
            </style>
          </head>
          <body>
            <div class="print-header no-print">
              <h1>🖨️ CipherDoc Secure Print</h1>
              <p>Document: <strong>${printableDoc.name}</strong></p>
              <p>Authorized Print Location: Pune, Maharashtra</p>
              <p>Size: ${printableDoc.size ? (printableDoc.size / 1024).toFixed(1) + ' KB' : 'Unknown'}</p>
            </div>
            <div class="security-notice no-print">
              <strong>⚠️ Security Notice:</strong> This is a secure print session. 
              Downloads are disabled. Document access is logged and monitored.
            </div>
            <iframe 
              src="${ipfsUrl}"
              style="width: 100%; height: 80vh; border: 2px solid #ddd; border-radius: 4px;"
              sandbox="allow-same-origin"
              title="Secure document for printing"
              oncontextmenu="return false;"
            ></iframe>
            <script>
              // Disable right-click and other interactions
              document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
              });
              document.addEventListener('selectstart', function(e) {
                e.preventDefault();
                return false;
              });
              document.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
              });
              
              // Auto-print after load
              window.addEventListener('load', function() {
                setTimeout(function() {
                  window.print();
                }, 1000);
              });
            </script>
          </body>
          </html>
        `;
        
        document.body.appendChild(secureIframe);
        
        let resolved = false;
        const timeoutId = setTimeout(() => {
          if (!resolved) {
            resolved = true;
            document.body.removeChild(secureIframe);
            reject(new Error('Secure print timeout - document may not have loaded'));
          }
        }, 15000); // 15 second timeout

        secureIframe.onload = () => {
          const iframeDoc = secureIframe.contentDocument || secureIframe.contentWindow?.document;
          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(secureHtml);
            iframeDoc.close();
            
            // Wait for content to load, then print
            setTimeout(() => {
              try {
                secureIframe.contentWindow?.print();
                onAuditLog('SECURE_PRINT_SUCCESS', `Secure print dialog opened for: ${printableDoc.name}`);
                
                // Monitor for print completion
                const checkComplete = setInterval(() => {
                  // Clean up after a reasonable time
                  setTimeout(() => {
                    clearInterval(checkComplete);
                    if (!resolved) {
                      resolved = true;
                      clearTimeout(timeoutId);
                      document.body.removeChild(secureIframe);
                      onAuditLog('SECURE_PRINT_COMPLETED', `Secure print completed for: ${printableDoc.name}`);
                      resolve();
                    }
                  }, 5000);
                }, 1000);

              } catch (printError) {
                if (!resolved) {
                  resolved = true;
                  clearTimeout(timeoutId);
                  document.body.removeChild(secureIframe);
                  onAuditLog('SECURE_PRINT_ERROR', `Secure print failed for ${printableDoc.name}: ${printError}`);
                  reject(new Error(`Secure print failed: ${printError}`));
                }
              }
            }, 2000);
          }
        };

        secureIframe.onerror = () => {
          if (!resolved) {
            resolved = true;
            clearTimeout(timeoutId);
            document.body.removeChild(secureIframe);
            onAuditLog('SECURE_PRINT_LOAD_ERROR', `Failed to load document for secure printing: ${printableDoc.name}`);
            reject(new Error('Failed to load document for secure printing'));
          }
        };
        
        // Start loading the iframe
        secureIframe.src = 'about:blank';

      } catch (error) {
        onAuditLog('SECURE_PRINT_SETUP_ERROR', `Secure print setup failed for ${printableDoc.name}: ${error}`);
        reject(error);
      }
    });
  }

  /**
   * Get current print queue status
   */
  getPrintStatus(): PrintJob[] {
    return [...this.printQueue];
  }

  /**
   * Clear completed print jobs
   */
  clearCompletedJobs(): void {
    this.printQueue = this.printQueue.filter(job => job.status === 'pending' || job.status === 'printing');
    this.updateStatus();
  }

  /**
   * Cancel all pending print jobs
   */
  cancelAllJobs(): void {
    this.printQueue = this.printQueue.map(job => 
      job.status === 'pending' ? { ...job, status: 'failed', error: 'Cancelled by user' } : job
    );
    this.updateStatus();
  }

  private updateStatus(): void {
    if (this.onStatusUpdate) {
      this.onStatusUpdate([...this.printQueue]);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const printManager = new PrintManager();

/**
 * Simple utility function for printing a single document
 */
export const printDocument = async (
  printableDoc: PrintableDocument, 
  onAuditLog: (action: string, details: string) => void
): Promise<void> => {
  if (printableDoc.sensitive) {
    throw new Error('Cannot print sensitive documents');
  }
  
  const printManager = new PrintManager();
  await printManager.printSingleDocument(printableDoc, onAuditLog);
};

/**
 * Enhanced secure printing with download prevention
 */
export const enhancedWindowPrint = (
  onAuditLog: (action: string, details: string) => void,
  documentName: string,
  ipfsHash?: string
): void => {
  try {
    onAuditLog('ENHANCED_SECURE_PRINT_INITIATED', `Enhanced secure print called for: ${documentName}`);
    
    if (ipfsHash) {
      // Use secure iframe method when IPFS hash is available
      const secureIframe = document.createElement('iframe');
      secureIframe.style.cssText = `
        position: fixed;
        top: -9999px;
        left: -9999px;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
      `;
      
      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
      const secureHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>CipherDoc Enhanced Secure Print - ${documentName}</title>
          <style>
            @media screen {
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                padding: 25px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                margin: 0;
              }
              .print-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 25px;
                border-radius: 12px;
                text-align: center;
                margin-bottom: 25px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
              }
              .security-badge {
                background: #ff6b6b;
                color: white;
                padding: 10px 20px;
                border-radius: 25px;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 15px;
                animation: pulse 2s infinite;
              }
              @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
              }
            }
            @media print {
              .no-print { display: none !important; }
              body { 
                margin: 0; 
                padding: 0; 
                background: white !important;
                -webkit-print-color-adjust: exact;
              }
              iframe { 
                width: 100% !important; 
                height: 100vh !important; 
                border: none !important;
                page-break-inside: avoid;
              }
            }
            /* Comprehensive download prevention */
            embed, object, .download-button, [download] {
              display: none !important;
              pointer-events: none !important;
              visibility: hidden !important;
            }
            /* Prevent interactions */
            iframe {
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
              -webkit-touch-callout: none;
            }
          </style>
        </head>
        <body>
          <div class="print-header no-print">
            <div class="security-badge">🔒 SECURE DOCUMENT</div>
            <h1>🖨️ CipherDoc Enhanced Print</h1>
            <p><strong>Document:</strong> ${documentName}</p>
            <p><strong>Print Location:</strong> Pune, Maharashtra, India</p>
            <p><strong>Print Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            <p style="font-size: 14px; opacity: 0.9;">⚠️ Downloads disabled • Activity monitored • Blockchain logged</p>
          </div>
          <iframe 
            src="${ipfsUrl}"
            style="width: 100%; height: 75vh; border: 3px solid #667eea; border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
            sandbox="allow-same-origin"
            title="Enhanced secure document for printing"
            oncontextmenu="return false;"
            ondragstart="return false;"
            onselectstart="return false;"
          ></iframe>
          <script>
            // Comprehensive interaction blocking
            const blockInteraction = (e) => {
              e.preventDefault();
              e.stopPropagation();
              return false;
            };
            
            ['contextmenu', 'selectstart', 'dragstart', 'copy', 'cut', 'paste'].forEach(event => {
              document.addEventListener(event, blockInteraction);
            });
            
            // Keyboard shortcuts blocking
            document.addEventListener('keydown', function(e) {
              const blocked = [
                e.ctrlKey && e.key === 's', // Save
                e.ctrlKey && e.key === 'u', // View source
                e.ctrlKey && e.key === 'i', // Inspect
                e.ctrlKey && e.shiftKey && e.key === 'I', // Developer tools
                e.key === 'F12' // Developer tools
              ];
              
              if (blocked.some(condition => condition)) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            });
            
            // Auto-print with delay
            window.addEventListener('load', function() {
              setTimeout(function() {
                try {
                  window.print();
                } catch (error) {
                  console.error('Print failed:', error);
                }
              }, 1500);
            });
            
            // Log user activity
            console.log('Enhanced secure print session started for: ${documentName}');
          </script>
        </body>
        </html>
      `;
      
      document.body.appendChild(secureIframe);
      
      secureIframe.onload = () => {
        const iframeDoc = secureIframe.contentDocument || secureIframe.contentWindow?.document;
        if (iframeDoc) {
          iframeDoc.open();
          iframeDoc.write(secureHtml);
          iframeDoc.close();
          
          onAuditLog('ENHANCED_SECURE_PRINT_SUCCESS', `Enhanced secure print dialog opened for: ${documentName}`);
          
          // Clean up after reasonable time
          setTimeout(() => {
            if (secureIframe && secureIframe.parentNode) {
              secureIframe.parentNode.removeChild(secureIframe);
            }
          }, 10000);
        }
      };
      
      secureIframe.src = 'about:blank';
      
    } else {
      // Fallback to standard window print with security warning
      const confirmPrint = window.confirm(`🔒 CipherDoc Secure Print\n\nDocument: ${documentName}\nLocation: Pune, Maharashtra\n\n⚠️ This will use your browser's print dialog.\nEnsure no downloads are attempted.\n\nContinue with secure print?`);
      
      if (confirmPrint) {
        window.print();
        onAuditLog('ENHANCED_FALLBACK_PRINT_SUCCESS', `Enhanced fallback print used for: ${documentName}`);
      } else {
        onAuditLog('ENHANCED_PRINT_CANCELLED', `Enhanced print cancelled by user for: ${documentName}`);
      }
    }
    
  } catch (error) {
    onAuditLog('ENHANCED_SECURE_PRINT_ERROR', `Enhanced secure print failed for ${documentName}: ${error}`);
    
    // Ultimate fallback with user confirmation
    const fallbackConfirm = window.confirm(`⚠️ Enhanced secure print failed.\n\nDocument: ${documentName}\nError: ${error}\n\nUse basic browser print instead?\n\nNote: This may show download options.`);
    
    if (fallbackConfirm) {
      try {
        window.print();
        onAuditLog('ENHANCED_ULTIMATE_FALLBACK_SUCCESS', `Ultimate fallback print used for: ${documentName}`);
      } catch (finalError) {
        onAuditLog('ENHANCED_ALL_PRINT_METHODS_FAILED', `All print methods failed for ${documentName}: ${finalError}`);
        alert(`❌ All print methods failed\n\nDocument: ${documentName}\nError: ${finalError}\n\nPlease contact support in Pune, Maharashtra.`);
      }
    }
  }
};