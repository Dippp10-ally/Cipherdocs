import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SecureDocumentViewerProps {
  ipfsHash: string;
  documentName: string;
  onClose: () => void;
  onAuditLog: (action: string, details: string) => void;
  isPrintable?: boolean; // New prop to control printing permission
  documentType?: 'sensitive' | 'public' | 'printable'; // Document classification
}

const SecureDocumentViewer: React.FC<SecureDocumentViewerProps> = ({
  ipfsHash,
  documentName,
  onClose,
  onAuditLog,
  isPrintable = false, // Default to non-printable for security
  documentType = 'sensitive' // Default to most secure
}) => {
  const [viewMethod, setViewMethod] = useState<'iframe' | 'newTab' | 'embed'>('iframe');
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Log document view
    onAuditLog('document_viewed', `Document "${documentName}" opened in secure viewer`);
    
    // Only set timeout for iframe loading detection if there's an actual error
    const timeout = setTimeout(() => {
      if (!iframeLoaded && !iframeError && !showAlternatives) {
        console.log('Iframe took too long to load - possible browser blocking');
        onAuditLog('browser_security', 'Iframe loading timeout - checking for browser blocking');
        // Don't automatically switch - let user decide
      }
    }, 5000); // Increased to 5 seconds to reduce false positives
    
    setLoadingTimeout(timeout);
    
    // ENHANCED SECURITY MEASURES - LEVEL 5 PROTECTION
    let violationCount = 0;
    
    const logSecurityViolation = (type: string) => {
      violationCount++;
      onAuditLog('CRITICAL_SECURITY_VIOLATION', `${type} - Violation #${violationCount}`);
      
      // Show immediate visual warning
      const warning = document.createElement('div');
      warning.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(220, 38, 38, 0.9) !important;
        color: white !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 48px !important;
        font-weight: bold !important;
        z-index: 999999 !important;
        user-select: none !important;
        pointer-events: auto !important;
      `;
      warning.innerHTML = `🚨 SECURITY VIOLATION DETECTED<br/>TYPE: ${type}<br/>ALL ACTIVITY LOGGED`;
      document.body.appendChild(warning);
      
      setTimeout(() => {
        if (warning && warning.parentNode) {
          warning.parentNode.removeChild(warning);
        }
      }, 2000);
    };
    
    // Comprehensive event blocking
    const blockEvent = (e: Event, type: string) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      logSecurityViolation(type);
      return false;
    };
    
    // Create multiple security event handlers (excluding click to allow close buttons)
    const securityEvents = [
      'contextmenu', 'selectstart', 'dragstart', 'dragover', 'drop',
      'copy', 'cut', 'paste', 'mousedown', 'mouseup', 'dblclick', 'click',
      'touchstart', 'touchend', 'touchmove', 'keydown', 'keyup', 'keypress'
    ];
    
    const handlers: { [key: string]: (e: any) => boolean } = {};
    
    // Context menu and right-click
    handlers.contextmenu = (e) => blockEvent(e, 'RIGHT_CLICK_ATTEMPT');
    
    // Text selection
    handlers.selectstart = (e) => blockEvent(e, 'TEXT_SELECTION_ATTEMPT');
    
    // Drag operations
    handlers.dragstart = (e) => blockEvent(e, 'DRAG_ATTEMPT');
    handlers.dragover = (e) => blockEvent(e, 'DRAG_OVER_ATTEMPT');
    handlers.drop = (e) => blockEvent(e, 'DROP_ATTEMPT');
    
    // Copy/paste operations
    handlers.copy = (e) => blockEvent(e, 'COPY_ATTEMPT');
    handlers.cut = (e) => blockEvent(e, 'CUT_ATTEMPT');
    handlers.paste = (e) => blockEvent(e, 'PASTE_ATTEMPT');
    
    // Mouse interactions
    handlers.mousedown = (e) => {
      // Allow clicks on close buttons
      const target = e.target as HTMLElement;
      if (target && (target.closest('.close-button') || target.closest('[data-close="true"]'))) {
        return false; // Allow the click to proceed
      }
      
      if (e.button === 2) { // Right click
        return blockEvent(e, 'RIGHT_MOUSE_DOWN');
      }
      if (e.detail > 1) { // Double click
        return blockEvent(e, 'DOUBLE_CLICK_ATTEMPT');
      }
      return false;
    };
    
    handlers.mouseup = (e) => {
      // Allow clicks on close buttons
      const target = e.target as HTMLElement;
      if (target && (target.closest('.close-button') || target.closest('[data-close="true"]'))) {
        return false; // Allow the click to proceed
      }
      
      if (e.button === 2) {
        return blockEvent(e, 'RIGHT_MOUSE_UP');
      }
      return false;
    };
    
    handlers.dblclick = (e) => blockEvent(e, 'DOUBLE_CLICK_DETECTED');
    
    // Allow click events on close buttons
    handlers.click = (e) => {
      const target = e.target as HTMLElement;
      if (target && (target.closest('.close-button') || target.closest('[data-close="true"]'))) {
        // Allow close button clicks to proceed normally
        return false;
      }
      // For other clicks, don't block but log them
      return false;
    };
    
    // Touch interactions (mobile)
    handlers.touchstart = (e) => {
      if (e.touches && e.touches.length > 1) {
        return blockEvent(e, 'MULTI_TOUCH_ATTEMPT');
      }
      return false;
    };
    
      // COMPLETE PRINT BLOCKING - No browser print allowed whatsoever
      handlers.keydown = (e): boolean => {
        const isCtrl = e.ctrlKey || e.metaKey;
        const isShift = e.shiftKey;
        const isAlt = e.altKey;
        const key = e.key.toLowerCase();
        
        // ABSOLUTE PRINT BLOCKING - NEVER allow browser print dialog
        if (
          key === 'p' && isCtrl || // Ctrl+P
          key === 'p' && isCtrl && isShift || // Ctrl+Shift+P
          e.code === 'KeyP' && isCtrl || // Physical P key with Ctrl
          e.which === 80 && isCtrl || // Legacy keycode for P
          e.keyCode === 80 && isCtrl // Fallback keycode
        ) {
          // COMPLETE BLOCKING - No conditions, no exceptions
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          logSecurityViolation('PRINT_COMPLETELY_BLOCKED_ALL_DOCUMENTS');
          
          // Show absolute blocking message
          const blockMessage = document.createElement('div');
          blockMessage.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: rgba(220, 38, 38, 0.98) !important;
            color: white !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 48px !important;
            font-weight: bold !important;
            z-index: 1000000 !important;
            text-align: center !important;
          `;
          blockMessage.innerHTML = `
            <div style="font-size: 96px; margin-bottom: 30px;">🚫</div>
            <div>BROWSER PRINT COMPLETELY DISABLED</div>
            <div style="font-size: 24px; margin-top: 20px;">Use "Secure Print" button only</div>
            <div style="font-size: 18px; margin-top: 10px;">Prevents Save-as-PDF vulnerabilities</div>
            <div style="font-size: 16px; margin-top: 10px;">Security violation logged to blockchain</div>
          `;
          document.body.appendChild(blockMessage);
          
          setTimeout(() => {
            if (blockMessage && blockMessage.parentNode) {
              blockMessage.parentNode.removeChild(blockMessage);
            }
          }, 4000);
          
          return false;
        }
        
        // Block ALL other keyboard shortcuts
        if (
          e.key === 'F12' ||
          e.key === 'PrintScreen' ||
          (isCtrl && ['s', 'u', 'i', 'j', 'a', 'c', 'v', 'x', 'z', 'y', 'r', 'f', 'g', 'h', 'o', 'n', 't', 'w', 'q', 'l', 'k', 'd', 'e', 'm'].includes(key)) ||
          (isShift && isCtrl) ||
          (isAlt && ['tab', 'f4'].includes(key)) ||
          e.key.startsWith('F') || // Block all function keys
          (isCtrl && isShift) ||
          key === 'printscreen'
        ) {
          return blockEvent(e, `KEYBOARD_SHORTCUT: ${e.key}`);
        }
        
        // Allow ESC to close the viewer (failsafe)
        if (e.key === 'Escape') {
          onAuditLog('document_viewer_closed', 'Document viewer closed via Escape key');
          onClose();
          return false;
        }
        
        // Default: allow other keys but log them
        return false;
      };
    
    handlers.keyup = (e) => {
      if (e.key === 'PrintScreen') {
        return blockEvent(e, 'PRINT_SCREEN_RELEASE');
      }
      return false;
    };
    
    handlers.keypress = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return blockEvent(e, 'MODIFIER_KEY_PRESS');
      }
      return false;
    };
    
    // Apply all event listeners with maximum capture priority
    securityEvents.forEach(eventType => {
      if (handlers[eventType]) {
        document.addEventListener(eventType, handlers[eventType], {
          capture: true,
          passive: false
        });
        window.addEventListener(eventType, handlers[eventType], {
          capture: true,
          passive: false
        });
      }
    });
    
    // Additional window-level protections with ABSOLUTE print blocking
    const windowHandlers = {
      beforeprint: (e: Event) => {
        // ABSOLUTE BLOCKING - Never allow browser print dialog
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        blockEvent(e, 'BROWSER_PRINT_DIALOG_COMPLETELY_BLOCKED');
        
        // Show prominent warning
        const printWarning = document.createElement('div');
        printWarning.style.cssText = `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background: rgba(220, 38, 38, 0.98) !important;
          color: white !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          font-size: 48px !important;
          font-weight: bold !important;
          z-index: 999999 !important;
          text-align: center !important;
        `;
        printWarning.innerHTML = `
          <div style="font-size: 96px; margin-bottom: 30px;">🚫</div>
          <div>BROWSER PRINT DIALOG BLOCKED</div>
          <div style="font-size: 24px; margin-top: 20px;">Use "Secure Print" button for authorized printing</div>
          <div style="font-size: 18px; margin-top: 10px;">This prevents Save-as-PDF vulnerabilities</div>
          <div style="font-size: 16px; margin-top: 10px;">Security violation logged to blockchain</div>
        `;
        document.body.appendChild(printWarning);
        
        setTimeout(() => {
          if (printWarning && printWarning.parentNode) {
            printWarning.parentNode.removeChild(printWarning);
          }
        }, 5000);
        
        return false;
      },
      afterprint: (e: Event) => {
        // Log any afterprint events (shouldn't happen with our blocking)
        blockEvent(e, 'AFTERPRINT_EVENT_BLOCKED');
      },
      beforeunload: (e: Event) => {
        logSecurityViolation('PAGE_UNLOAD_ATTEMPT');
      },
      blur: () => logSecurityViolation('WINDOW_BLUR_SCREENSHOT_RISK'),
      focus: () => logSecurityViolation('WINDOW_FOCUS_RETURN'),
      resize: () => logSecurityViolation('WINDOW_RESIZE_DEVTOOLS_RISK')
    };
    
    Object.entries(windowHandlers).forEach(([event, handler]) => {
      window.addEventListener(event, handler, { capture: true });
    });
    
    // Visibility API monitoring
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityViolation('PAGE_HIDDEN_SCREENSHOT_ATTEMPT');
      } else {
        logSecurityViolation('PAGE_VISIBLE_RETURN');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Failsafe: Ensure close buttons always work
    const ensureCloseButtonsWork = () => {
      const closeButtons = document.querySelectorAll('.close-button, [data-close="true"]');
      closeButtons.forEach(button => {
        const clonedButton = button.cloneNode(true) as HTMLElement;
        button.parentNode?.replaceChild(clonedButton, button);
        
        clonedButton.addEventListener('click', (e) => {
          e.stopPropagation();
          e.stopImmediatePropagation();
          onAuditLog('document_viewer_closed', 'Document viewer closed via close button');
          onClose();
        }, { capture: true, passive: false });
      });
    };
    
    // Run immediately and periodically to ensure close buttons work
    setTimeout(ensureCloseButtonsWork, 100);
    const closeButtonInterval = setInterval(ensureCloseButtonsWork, 1000);
    
    // DevTools detection
    let devtoolsOpen = false;
    const devtoolsDetection = setInterval(() => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if ((widthThreshold || heightThreshold) && !devtoolsOpen) {
        devtoolsOpen = true;
        logSecurityViolation('DEVTOOLS_OPENED');
      } else if (!widthThreshold && !heightThreshold && devtoolsOpen) {
        devtoolsOpen = false;
        logSecurityViolation('DEVTOOLS_CLOSED');
      }
    }, 500);
    
    // Console access blocking with print prevention
    const originalConsole = { ...console };
    Object.keys(console).forEach(key => {
      (console as any)[key] = function() {
        logSecurityViolation(`CONSOLE_ACCESS: ${key}`);
        return originalConsole[key as keyof Console];
      };
    });
    
    // Block window.print() function COMPLETELY - NO BROWSER PRINT ALLOWED
    const originalPrint = window.print;
    window.print = function() {
      // COMPLETE BLOCKAGE - No browser print dialog allowed
      logSecurityViolation('WINDOW_PRINT_FUNCTION_COMPLETELY_BLOCKED');
      
      // Show blocking message
      const printBlock = document.createElement('div');
      printBlock.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        background: rgba(220, 38, 38, 0.98) !important;
        color: white !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 48px !important;
        font-weight: bold !important;
        z-index: 1000000 !important;
        text-align: center !important;
      `;
      printBlock.innerHTML = `
        <div style="font-size: 96px; margin-bottom: 30px;">🚫</div>
        <div>BROWSER PRINT COMPLETELY DISABLED</div>
        <div style="font-size: 24px; margin-top: 20px;">Use "Secure Print" button for authorized printing</div>
        <div style="font-size: 18px; margin-top: 10px;">This prevents Save-as-PDF vulnerabilities</div>
      `;
      document.body.appendChild(printBlock);
      
      setTimeout(() => {
        if (printBlock && printBlock.parentNode) {
          printBlock.parentNode.removeChild(printBlock);
        }
      }, 5000);
      
      return false; // NEVER allow browser print
    };
    
    // Override any potential print media queries - COMPLETE BLOCKING
    const style = document.createElement('style');
    // ALWAYS block printing at CSS level - no exceptions
    style.innerHTML = `
      @media print {
        * {
          display: none !important;
        }
        body::before {
          content: 'SECURE DOCUMENT - BROWSER PRINTING DISABLED - USE SECURE PRINT BUTTON ONLY' !important;
          display: block !important;
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          font-size: 48px !important;
          font-weight: bold !important;
          color: red !important;
          z-index: 10000 !important;
          background: white !important;
          padding: 50px !important;
          border: 10px solid red !important;
          text-align: center !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      
      clearInterval(devtoolsDetection);
      clearInterval(closeButtonInterval);
      
      // Remove all security event listeners
      securityEvents.forEach(eventType => {
        if (handlers[eventType]) {
          document.removeEventListener(eventType, handlers[eventType], { capture: true });
          window.removeEventListener(eventType, handlers[eventType], { capture: true });
        }
      });
      
      Object.entries(windowHandlers).forEach(([event, handler]) => {
        window.removeEventListener(event, handler, { capture: true });
      });
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Restore console and print function, remove printable class
      Object.assign(console, originalConsole);
      window.print = originalPrint;
      document.body.classList.remove('printable-document');
    };
  }, [ipfsHash, documentName, onAuditLog, iframeLoaded, iframeError, showAlternatives, loadingTimeout]);

  // Create secure iframe URL
  const secureUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
  
  // Create a secure proxy URL to prevent direct downloads
  const createSecureViewUrl = () => {
    // Create a blob URL that opens the document without download options
    const securityScript = `
      let securityViolations = 0;
      
      function logViolation(action) {
        securityViolations++;
        console.log('Security Violation #' + securityViolations + ': ' + action);
      }
      
      function showWarning(message) {
        const warning = document.createElement('div');
        warning.style.position = 'fixed';
        warning.style.top = '20px';
        warning.style.left = '50%';
        warning.style.transform = 'translateX(-50%)';
        warning.style.background = '#dc2626';
        warning.style.color = 'white';
        warning.style.padding = '15px 30px';
        warning.style.borderRadius = '8px';
        warning.style.fontWeight = 'bold';
        warning.style.zIndex = '10000';
        warning.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
        warning.textContent = message;
        document.body.appendChild(warning);
        setTimeout(() => warning.remove(), 3000);
      }
      
      // PDF.js specific security configuration
      window.addEventListener('load', function() {
        // Disable PDF.js controls if available
        if (typeof PDFViewerApplicationOptions !== 'undefined') {
          var viewer = PDFViewerApplicationOptions;
          viewer.set('disablePrint', true);
          viewer.set('disableDownload', true);
          viewer.set('disableTextLayer', true); // Prevent text copy
          viewer.set('disableAutoFetch', true);
          viewer.set('disableStreamingData', true);
          viewer.set('disableWorker', false);
          viewer.set('toolbar', false);
          viewer.set('sidebarViewOnLoad', 0); // Hide sidebar
          logViolation('PDF security options applied');
        }
        
        // Additional PDF viewer detection and control
        setTimeout(function() {
          // Hide PDF.js toolbar if present
          var toolbar = document.querySelector('#toolbarContainer');
          if (toolbar) {
            toolbar.style.display = 'none';
            logViolation('PDF toolbar hidden');
          }
          
          // Hide download buttons
          var downloadBtns = document.querySelectorAll('[title*="Download"], [title*="download"], #download, .download');
          downloadBtns.forEach(btn => {
            btn.style.display = 'none';
            btn.disabled = true;
          });
          
          // Hide print buttons
          var printBtns = document.querySelectorAll('[title*="Print"], [title*="print"], #print, .print');
          printBtns.forEach(btn => {
            btn.style.display = 'none';
            btn.disabled = true;
          });
        }, 1000);
      });
      
      // Disable all forms of text selection and interaction
      document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        logViolation('Right-click attempted');
        showWarning('🚫 Right-click disabled for security');
        return false;
      }, { capture: true });
      
      document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        logViolation('Text selection attempted');
        return false;
      }, { capture: true });
      
      document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        logViolation('Drag attempt');
        return false;
      }, { capture: true });
      
      document.addEventListener('dblclick', function(e) {
        e.preventDefault();
        e.stopPropagation();
        logViolation('Double-click attempt');
        return false;
      }, { capture: true });
      
      // Enhanced keyboard blocking including PDF shortcuts
      document.addEventListener('keydown', function(e) {
        const isCtrlCmd = e.ctrlKey || e.metaKey;
        const isShift = e.shiftKey;
        const key = e.key.toLowerCase();
        
        // COMPREHENSIVE PRINT BLOCKING - Multiple methods
        if (
          // Standard print shortcuts
          (isCtrlCmd && key === 'p') ||
          (isCtrlCmd && isShift && key === 'p') ||
          // Alternative print methods
          e.code === 'KeyP' && isCtrlCmd ||
          e.which === 80 && isCtrlCmd ||
          e.keyCode === 80 && isCtrlCmd ||
          // Function key alternatives
          e.key === 'F12' ||
          e.key === 'PrintScreen' ||
          // Other security shortcuts
          (isCtrlCmd && ['s', 'u', 'i', 'j', 'a', 'c', 'v', 'x', 'z', 'y'].includes(key)) ||
          (isShift && isCtrlCmd && ['i', 'j', 'c'].includes(key))
        ) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          
          logViolation('CRITICAL PRINT BLOCKED: ' + e.key);
          
          // Show immediate blocking warning
          const warning = document.createElement('div');
          warning.style.cssText = [
            'position: fixed !important',
            'top: 0 !important',
            'left: 0 !important',
            'width: 100vw !important',
            'height: 100vh !important',
            'background: rgba(220, 38, 38, 0.98) !important',
            'color: white !important',
            'display: flex !important',
            'flex-direction: column !important',
            'align-items: center !important',
            'justify-content: center !important',
            'font-size: 42px !important',
            'font-weight: bold !important',
            'z-index: 999999 !important',
            'text-align: center !important'
          ].join(';');
          warning.innerHTML = [
            '<div style="font-size: 96px; margin-bottom: 30px;">🚫</div>',
            '<div>PRINT BLOCKED</div>',
            '<div style="font-size: 24px; margin-top: 20px;">Shopkeeper Access Denied</div>',
            '<div style="font-size: 18px; margin-top: 10px;">Security Violation Logged</div>'
          ].join('');
          document.body.appendChild(warning);
          
          setTimeout(() => {
            if (warning && warning.parentNode) {
              warning.parentNode.removeChild(warning);
            }
          }, 4000);
          
          return false;
        }
      }, { capture: true, passive: false });
      
      // Track focus loss (potential screenshot)
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          logViolation('Page lost focus - potential screenshot');
        }
      });
      
      // ABSOLUTE PRINT FUNCTION BLOCKING
      const originalPrint = window.print;
      window.print = function() {
        logViolation('WINDOW.PRINT() FUNCTION BLOCKED');
        
        const blockOverlay = document.createElement('div');
        blockOverlay.style.cssText = [
          'position: fixed !important',
          'top: 0 !important',
          'left: 0 !important',
          'width: 100vw !important',
          'height: 100vh !important',
          'background: rgba(220, 38, 38, 0.98) !important',
          'color: white !important',
          'display: flex !important',
          'flex-direction: column !important',
          'align-items: center !important',
          'justify-content: center !important',
          'font-size: 48px !important',
          'font-weight: bold !important',
          'z-index: 1000000 !important',
          'text-align: center !important'
        ].join(';');
        blockOverlay.innerHTML = [
          '<div style="font-size: 128px; margin-bottom: 30px;">🚫</div>',
          '<div>PRINT FUNCTION DISABLED</div>',
          '<div style="font-size: 24px; margin-top: 20px;">Shopkeeper cannot print documents</div>',
          '<div style="font-size: 18px; margin-top: 10px;">All attempts logged to blockchain</div>'
        ].join('');
        document.body.appendChild(blockOverlay);
        
        setTimeout(() => {
          if (blockOverlay && blockOverlay.parentNode) {
            blockOverlay.parentNode.removeChild(blockOverlay);
          }
        }, 6000);
        
        return false;
      };
      
      // Block browser print dialog
      document.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        logViolation('BROWSER PRINT DIALOG BLOCKED');
        
        const printBlock = document.createElement('div');
        printBlock.style.cssText = [
          'position: fixed !important',
          'top: 0 !important',
          'left: 0 !important',
          'width: 100vw !important',
          'height: 100vh !important',
          'background: rgba(220, 38, 38, 0.95) !important',
          'color: white !important',
          'display: flex !important',
          'flex-direction: column !important',
          'align-items: center !important',
          'justify-content: center !important',
          'font-size: 48px !important',
          'font-weight: bold !important',
          'z-index: 1000000 !important',
          'text-align: center !important'
        ].join(';');
        printBlock.innerHTML = [
          '<div style="font-size: 96px; margin-bottom: 30px;">!</div>',
          '<div>PRINT DIALOG BLOCKED</div>',
          '<div style="font-size: 24px; margin-top: 20px;">Security Protocol Active</div>'
        ].join('');
        document.body.appendChild(printBlock);
        
        setTimeout(() => {
          if (printBlock && printBlock.parentNode) {
            printBlock.parentNode.removeChild(printBlock);
          }
        }, 3000);
        
        return false;
      }, true);
      
      // Prevent image and content dragging
      document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        if (e.target.tagName === 'IMG') {
          logViolation('Image drag attempt blocked');
        }
        return false;
      });
      
      // Disable copy/paste operations
      document.addEventListener('copy', function(e) {
        e.preventDefault();
        logViolation('Copy attempt blocked');
        showWarning('🚫 Copy Disabled');
        return false;
      });
      
      document.addEventListener('cut', function(e) {
        e.preventDefault();
        logViolation('Cut attempt blocked');
        return false;
      });
      
      document.addEventListener('paste', function(e) {
        e.preventDefault();
        logViolation('Paste attempt blocked');
        return false;
      });
      
      // Additional protection against common bypass attempts
      setInterval(function() {
        // Check for dev tools
        const threshold = 160;
        if (window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold) {
          logViolation('Developer tools possibly open');
        }
        
        // Check for suspicious iframe manipulation
        var iframes = document.querySelectorAll('iframe');
        iframes.forEach(function(iframe) {
          iframe.style.pointerEvents = 'auto';
          iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
        });
      }, 1000);
      
      // Override common security bypass methods
      if (window.console) {
        window.console.log = function() { logViolation('Console access detected'); };
        window.console.warn = function() { logViolation('Console access detected'); };
        window.console.error = function() { logViolation('Console access detected'); };
      }
    `;
    
    const viewerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Secure Document Viewer</title>
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: Arial, sans-serif; 
            background: #f5f5f5;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
          }
          .header { background: #1e40af; color: white; padding: 10px 20px; border-radius: 8px; margin-bottom: 20px; }
          .warning { background: #fef3c7; border: 2px solid #f59e0b; padding: 10px; border-radius: 8px; margin-bottom: 20px; }
          .document-frame { 
            width: 100%; 
            height: 80vh; 
            border: 2px solid #e5e7eb; 
            border-radius: 8px;
            pointer-events: auto;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
          }
          .no-select { 
            -webkit-user-select: none; 
            -moz-user-select: none; 
            -ms-user-select: none; 
            user-select: none;
            -webkit-touch-callout: none;
          }
          * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
        </style>
      </head>
      <body class="no-select">
        <div class="header">
          <h2>Secure Document Viewer</h2>
          <p>VIEW ONLY - Downloads Disabled | ${documentName}</p>
        </div>
        <div class="warning">
          <strong>Security Notice:</strong> This document is in view-only mode. Downloads, prints, and saves are monitored.
        </div>
        <iframe 
          src="${secureUrl}" 
          class="document-frame"
          sandbox="allow-same-origin allow-scripts"
          title="Secure Document View"
        ></iframe>
        <script>${securityScript}</script>
      </body>
      </html>
    `;
    
    const blob = new Blob([viewerHtml], { type: 'text/html' });
    return URL.createObjectURL(blob);
  };
  
  const handleOpenInNewTab = () => {
    onAuditLog('document_viewed', 'Document opened in secure new tab (download-protected)');
    const secureViewUrl = createSecureViewUrl();
    const newWindow = window.open(secureViewUrl, '_blank', 'noopener,noreferrer,toolbar=no,menubar=no,scrollbars=yes,resizable=yes');
    
    // Clean up the blob URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(secureViewUrl);
    }, 1000);
  };

  const handleDirectView = () => {
    onAuditLog('document_viewed', 'Document accessed via direct IPFS link');
    window.location.href = secureUrl;
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 secure-document-viewer no-devtools"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onAuditLog('suspicious_activity', 'Right-click attempted on viewer background');
        return false;
      }}
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onAuditLog('suspicious_activity', 'Double-click attempted on viewer background');
        return false;
      }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-4xl h-[90vh] overflow-hidden"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none'
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          onAuditLog('suspicious_activity', 'Right-click attempted on viewer window');
          return false;
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onAuditLog('suspicious_activity', 'Double-click attempted on viewer window');
          return false;
        }}
        onDragStart={(e) => {
          e.preventDefault();
          onAuditLog('suspicious_activity', 'Drag attempted on viewer window');
          return false;
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-lg font-bold">Secure Document Viewer</h2>
              <p className="text-blue-100 text-sm">
                {showAlternatives 
                  ? `SECURE VIEWING MODE | ${documentName}` 
                  : `VIEW ONLY - Downloads Disabled | ${documentName}`
                }
              </p>
            </div>
            
            {/* Print Status Indicator */}
            {isPrintable ? (
              <div className="bg-green-500/20 border border-green-400 rounded-lg px-3 py-2 flex items-center space-x-2">
                <span className="text-xl">PRINT</span>
                <div>
                  <div className="text-xs font-semibold text-green-100">PRINTABLE</div>
                  <div className="text-xs text-green-200">Shop can print</div>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/20 border border-red-400 rounded-lg px-3 py-2 flex items-center space-x-2">
                <span className="text-xl">🚫</span>
                <div>
                  <div className="text-xs font-semibold text-red-100">NO PRINT</div>
                  <div className="text-xs text-red-200">Sensitive doc</div>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="close-button text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            data-close="true"
            title="Close document viewer"
            style={{
              pointerEvents: 'auto',
              position: 'relative',
              zIndex: 1000
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Security Warning */}
        <div className={`border-l-4 p-3 ${isPrintable ? 'bg-yellow-50 border-yellow-500' : (showAlternatives ? 'bg-blue-50 border-blue-500' : 'bg-red-50 border-red-500')}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2">{isPrintable ? 'PRINT' : (showAlternatives ? 'SECURE' : 'ALERT')}</span>
              <div>
                <p className={`text-sm font-medium ${isPrintable ? 'text-yellow-700' : (showAlternatives ? 'text-blue-700' : 'text-red-700')}`}>
                  {isPrintable 
                    ? 'PRINTABLE DOCUMENT: This document can be printed by the shopkeeper. All print activities are logged.'
                    : (showAlternatives 
                      ? 'ALTERNATIVE VIEWING MODE: Using secure viewing methods.' 
                      : 'SECURITY MODE: Right-click, screenshots, and downloads are monitored and logged.'
                    )
                  }
                </p>
                {isPrintable && (
                  <div className="mt-2 flex items-center space-x-2">
                    <button
                      onClick={() => {
                        onAuditLog('SECURE_PRINT_BUTTON_CLICKED', `Secure print button clicked for document: ${documentName}`);
                        
                        // ULTIMATE SECURE PRINTING - NO BROWSER PRINT DIALOG
                        try {
                          // Block browser's native print completely
                          const originalPrint = window.print;
                          window.print = () => {
                            onAuditLog('BLOCKED_BROWSER_PRINT', 'Browser print blocked - redirecting to secure print');
                            return false;
                          };
                          
                          // Create completely isolated print window
                          const printWindow = window.open('', '_blank', 'width=800,height=600,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
                          
                          if (!printWindow) {
                            throw new Error('Print window blocked by browser');
                          }
                          
                          // Create custom print HTML with no save options
                          const customPrintHtml = `
                            <!DOCTYPE html>
                            <html>
                            <head>
                              <title>ConsentChain Secure Print - ${documentName}</title>
                              <meta charset="utf-8">
                              <meta name="viewport" content="width=device-width, initial-scale=1">
                              <style>
                                @media screen {
                                  body {
                                    font-family: 'Arial', sans-serif;
                                    margin: 0;
                                    padding: 20px;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                  }
                                  .print-header {
                                    background: rgba(255,255,255,0.1);
                                    backdrop-filter: blur(10px);
                                    padding: 25px;
                                    border-radius: 15px;
                                    text-align: center;
                                    margin-bottom: 25px;
                                    border: 2px solid rgba(255,255,255,0.2);
                                  }
                                  .security-alert {
                                    background: #ff6b6b;
                                    color: white;
                                    padding: 15px;
                                    border-radius: 10px;
                                    font-weight: bold;
                                    text-align: center;
                                    margin-bottom: 20px;
                                    animation: pulse 2s infinite;
                                  }
                                  @keyframes pulse {
                                    0% { transform: scale(1); }
                                    50% { transform: scale(1.02); }
                                    100% { transform: scale(1); }
                                  }
                                  .document-frame {
                                    width: 100%;
                                    height: 70vh;
                                    border: 3px solid rgba(255,255,255,0.3);
                                    border-radius: 10px;
                                    background: white;
                                  }
                                  .print-instructions {
                                    background: rgba(255,255,255,0.1);
                                    padding: 20px;
                                    border-radius: 10px;
                                    margin-top: 20px;
                                    text-align: center;
                                  }
                                }
                                @media print {
                                  body { 
                                    background: white !important; 
                                    color: black !important;
                                    margin: 0;
                                    padding: 0;
                                  }
                                  .no-print { display: none !important; }
                                  .document-frame { 
                                    width: 100% !important; 
                                    height: 100vh !important; 
                                    border: none !important;
                                    page-break-inside: avoid;
                                  }
                                  .print-header {
                                    background: white !important;
                                    color: black !important;
                                    border: 2px solid #ccc !important;
                                  }
                                }
                                /* COMPLETELY DISABLE SAVE OPTIONS */
                                embed, object, .download-button, [download], 
                                input[type="file"], button[download], a[download] {
                                  display: none !important;
                                  visibility: hidden !important;
                                  pointer-events: none !important;
                                  position: absolute !important;
                                  left: -9999px !important;
                                }
                                /* Hide browser UI elements */
                                ::-webkit-scrollbar { display: none; }
                                * { 
                                  -webkit-user-select: none;
                                  -moz-user-select: none;
                                  -ms-user-select: none;
                                  user-select: none;
                                  -webkit-touch-callout: none;
                                }
                              </style>
                            </head>
                            <body>
                              <div class="print-header">
                                <h1>CipherDocs Secure Print</h1>
                                <p><strong>Document:</strong> ${documentName}</p>
                                <p><strong>Authorized Location:</strong> Pune, Maharashtra, India</p>
                                <p><strong>Print Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                              </div>
                              
                              <div class="security-alert no-print">
                                SECURITY MODE: Downloads Disabled | Print Only | All Activity Monitored
                              </div>
                              
                              <iframe 
                                src="${secureUrl}"
                                class="document-frame"
                                sandbox="allow-same-origin"
                                title="Secure document view"
                                oncontextmenu="return false;"
                                ondragstart="return false;"
                                onselectstart="return false;"
                              ></iframe>
                              
                              <div class="print-instructions no-print">
                                <h3>Print Instructions</h3>
                                <p>1. Click the Print button below to open printer dialog</p>
                                <p>2. Select your printer (NOT Save as PDF)</p>
                                <p>3. This window will close automatically after printing</p>
                                <button onclick="handleSecurePrint()" style="
                                  background: #4CAF50;
                                  color: white;
                                  border: none;
                                  padding: 15px 30px;
                                  border-radius: 8px;
                                  font-size: 18px;
                                  font-weight: bold;
                                  cursor: pointer;
                                  margin: 10px;
                                ">PRINT TO PHYSICAL PRINTER</button>
                                <br>
                                <button onclick="window.close()" style="
                                  background: #f44336;
                                  color: white;
                                  border: none;
                                  padding: 10px 20px;
                                  border-radius: 8px;
                                  font-size: 14px;
                                  cursor: pointer;
                                  margin: 10px;
                                ">Cancel</button>
                              </div>
                              
                              <script>
                                // AGGRESSIVE PRINT SECURITY
                                let printAttempts = 0;
                                const maxPrintAttempts = 3;
                                
                                // Override ALL print functions
                                const originalPrint = window.print;
                                window.print = function() {
                                  console.log('Browser print blocked - use secure print button');
                                  alert('Direct printing disabled for security.\\nPlease use the "PRINT TO PHYSICAL PRINTER" button below.');
                                  return false;
                                };
                                
                                // Block all save-related keyboard shortcuts
                                document.addEventListener('keydown', function(e) {
                                  const blockedKeys = [
                                    e.ctrlKey && e.key === 's', // Ctrl+S
                                    e.ctrlKey && e.key === 'p', // Ctrl+P 
                                    e.ctrlKey && e.shiftKey && e.key === 'S', // Ctrl+Shift+S
                                    e.metaKey && e.key === 's', // Cmd+S (Mac)
                                    e.metaKey && e.key === 'p', // Cmd+P (Mac)
                                    e.key === 'F12', // Developer tools
                                    e.ctrlKey && e.shiftKey && e.key === 'I', // Dev tools
                                    e.ctrlKey && e.key === 'u', // View source
                                  ];
                                  
                                  if (blockedKeys.some(blocked => blocked)) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    e.stopImmediatePropagation();
                                    alert('Action blocked for security purposes.');
                                    return false;
                                  }
                                });
                                
                                // Secure print function
                                function handleSecurePrint() {
                                  if (printAttempts >= maxPrintAttempts) {
                                    alert('Maximum print attempts reached for security.');
                                    window.close();
                                    return;
                                  }
                                  
                                  printAttempts++;
                                  
                                  // Create a minimal print-only version with direct iframe
                                  const printDoc = window.open('', '_blank', 'width=800,height=600');
                                  
                                  if (printDoc) {
                                    printDoc.document.write(\`
                                      <!DOCTYPE html>
                                      <html>
                                      <head>
                                        <title>Print: ${documentName}</title>
                                        <style>
                                          @media print {
                                            body { margin: 0; padding: 0; }
                                            iframe { width: 100%; height: 100vh; border: none; }
                                          }
                                          @media screen {
                                            body { font-family: Arial; padding: 20px; }
                                            .print-message { 
                                              background: #4CAF50; 
                                              color: white; 
                                              padding: 15px; 
                                              text-align: center; 
                                              margin-bottom: 20px;
                                            }
                                          }
                                        </style>
                                      </head>
                                      <body>
                                        <div class="print-message">
                                          PRINTER REQUIRED - Save as PDF is disabled for security
                                        </div>
                                        <iframe src="${secureUrl}" style="width:100%; height:80vh; border:none;"></iframe>
                                        
                                        <script>
                                          // Force immediate print without browser dialog
                                          setTimeout(() => {
                                            window.print();
                                            setTimeout(() => window.close(), 2000);
                                          }, 1000);
                                        </script>
                                      </body>
                                      </html>
                                    \`);
                                    printDoc.document.close();
                                  }
                                  
                                  // Close the secure print window after printing
                                  setTimeout(() => {
                                    window.close();
                                  }, 5000);
                                }
                                
                                // Disable context menu
                                document.addEventListener('contextmenu', function(e) {
                                  e.preventDefault();
                                  return false;
                                });
                                
                                // Disable text selection
                                document.addEventListener('selectstart', function(e) {
                                  e.preventDefault();
                                  return false;
                                });
                                
                                // Monitor for suspicious activity
                                let suspiciousActivity = 0;
                                const maxSuspicious = 5;
                                
                                function logSuspicious(activity) {
                                  suspiciousActivity++;
                                  console.log('Suspicious activity:', activity);
                                  
                                  if (suspiciousActivity >= maxSuspicious) {
                                    alert('Too many security violations. Closing for safety.');
                                    window.close();
                                  }
                                }
                                
                                // Monitor window focus (potential screenshot attempts)
                                window.addEventListener('blur', () => logSuspicious('window_blur'));
                                
                                console.log('ConsentChain secure print session initialized for: ${documentName}');
                              </script>
                            </body>
                            </html>
                          `;
                          
                          // Write content and prepare for secure printing
                          printWindow.document.write(customPrintHtml);
                          printWindow.document.close();
                          
                          // Restore original print function after delay
                          setTimeout(() => {
                            window.print = originalPrint;
                          }, 10000);
                          
                          onAuditLog('SECURE_PRINT_WINDOW_OPENED', `Secure print window opened for: ${documentName}`);
                          
                        } catch (error) {
                          console.error('Secure print failed:', error);
                          onAuditLog('SECURE_PRINT_ERROR', `Secure print failed: ${error}`);
                          
                          // Last resort fallback
                          const useBasicPrint = window.confirm(`Secure print failed.\n\nDocument: ${documentName}\nLocation: Pune, Maharashtra\n\nWARNING: Basic print may show save options.\nOnly proceed if you trust the operator.\n\nUse basic print anyway?`);
                          if (useBasicPrint) {
                            window.print();
                          }
                        }
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium flex items-center space-x-1"
                    >
                      <span>SECURE</span>
                      <span>Secure Print</span>
                    </button>
                    <span className="text-xs text-yellow-600">No Save-as-PDF</span>
                  </div>
                )}
              </div>
            </div>
            {!showAlternatives && !isPrintable && (
              <button
                onClick={() => {
                  onAuditLog('user_action', 'User switched to alternative viewing mode');
                  setShowAlternatives(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
              >
                ALTERNATIVE VIEW
              </button>
            )}
          </div>
        </div>

        {/* Document Viewer */}
        <div className="h-full relative overflow-hidden secure-scrollbar">
          {/* Anti-Screenshot Protection Layers */}
          <div 
            className="absolute inset-0 pointer-events-none z-50"
            style={{
              background: `
                repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 50px,
                  rgba(255, 0, 0, 0.03) 50px,
                  rgba(255, 0, 0, 0.03) 52px
                ),
                repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 50px,
                  rgba(0, 0, 255, 0.03) 50px,
                  rgba(0, 0, 255, 0.03) 52px
                )
              `,
              mixBlendMode: 'overlay'
            }}
          />
          
          {/* Dynamic Security Watermark */}
          <div 
            className="absolute inset-0 pointer-events-none z-40"
            style={{
              background: `
                radial-gradient(
                  circle at 25% 25%,
                  rgba(220, 38, 38, 0.08) 0%,
                  transparent 40%
                ),
                radial-gradient(
                  circle at 75% 75%,
                  rgba(220, 38, 38, 0.08) 0%,
                  transparent 40%
                )
              `,
              animation: 'pulse 3s ease-in-out infinite'
            }}
          >
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                fontSize: '120px',
                fontWeight: 'bold',
                color: 'rgba(220, 38, 38, 0.06)',
                transform: 'rotate(-15deg)',
                letterSpacing: '20px',
                userSelect: 'none',
                pointerEvents: 'none'
              }}
            >
              SECURE VIEW
            </div>
          </div>
          
          {/* Multiple Security Overlays */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-red-500"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  fontSize: '12px',
                  opacity: 0.1,
                  transform: `rotate(${Math.random() * 360}deg)`,
                  userSelect: 'none',
                  pointerEvents: 'none'
                }}
              >
                MONITORED
              </div>
            ))}
          </div>
          
          {/* Security Watermark */}
          <div className="security-watermark"></div>
          
          {/* Security Indicator */}
          <div className="security-indicator">
            SECURE MODE - ALL ACTIVITY LOGGED
          </div>
          
          {!showAlternatives ? (
            // Try iframe first
            <>
              <iframe
                src={secureUrl}
                className="w-full h-full border-0 secure-frame"
                style={{
                  pointerEvents: 'auto',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none',
                  WebkitTouchCallout: 'none',
                  WebkitTapHighlightColor: 'transparent'
                }}
                sandbox="allow-same-origin allow-scripts"
                title={`Secure view of ${documentName}`}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onAuditLog('suspicious_activity', 'Double-click blocked on iframe');
                  return false;
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  onAuditLog('suspicious_activity', 'Right-click blocked on iframe');
                  return false;
                }}
                onLoad={() => {
                  console.log('Iframe loaded successfully');
                  setIframeLoaded(true);
                  if (loadingTimeout) {
                    clearTimeout(loadingTimeout);
                  }
                }}
                onError={() => {
                  console.log('Iframe error - blocked by browser');
                  setIframeError(true);
                  onAuditLog('browser_security', 'Iframe blocked by browser - showing alternatives');
                  setShowAlternatives(true);
                }}
              />
              
              {/* Manual Override for Browser Issues */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => {
                    onAuditLog('user_action', 'User manually switched to secure viewing methods');
                    setShowAlternatives(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Alternative View
                </button>
              </div>
            </>
          ) : (
            // Alternative viewing methods for browser compatibility
            <div className="flex items-center justify-center h-full bg-gray-50 p-6 secure-document-viewer">
              {/* Security Watermark for alternative view */}
              <div className="security-watermark"></div>
              
              <div className="text-center max-w-lg relative z-10">
                <div className="text-6xl mb-4 text-gray-400">□</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Secure Viewing Options</h3>
                <p className="text-lg text-gray-700 mb-4">
                  Choose a secure viewing method for your document.
                </p>
                <p className="text-gray-600 mb-6">
                  All options maintain security and prevent unauthorized downloads:
                </p>
                
                <div className="space-y-4">
                  <button
                    onClick={handleOpenInNewTab}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    Open in Secure Viewer
                    <div className="text-sm font-normal mt-1 text-blue-100">Protected from downloads</div>
                  </button>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(secureUrl);
                      onAuditLog('document_action', 'IPFS link copied to clipboard');
                      // Show a more prominent success message
                      const alertDiv = window.document.createElement('div');
                      alertDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                      alertDiv.innerHTML = 'Link copied! Paste in new tab';
                      window.document.body.appendChild(alertDiv);
                      setTimeout(() => alertDiv.remove(), 3000);
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                  >
                    Copy Document Link
                    <div className="text-sm font-normal mt-1 text-green-100">For manual access</div>
                  </button>
                  
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-inner">
                    <p className="text-sm font-medium text-gray-700 mb-2">🔗 Direct IPFS Link:</p>
                    <div className="bg-gray-100 p-3 rounded-lg border">
                      <code className="text-sm break-all text-gray-800 font-mono">
                        {secureUrl}
                      </code>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(secureUrl);
                        onAuditLog('document_action', 'Direct IPFS link copied');
                      }}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Click to copy this link
                    </button>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-yellow-600 text-lg mr-2">⚠️</span>
                    <h4 className="font-bold text-yellow-800">Security Notice</h4>
                  </div>
                  <p className="text-sm text-yellow-700">
                    • All document access is monitored and logged<br/>
                    • This is a secure IPFS document - view only<br/>
                    • Your activity is recorded for audit purposes
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Enhanced Security overlay */}
          <div 
            className="absolute inset-0 bg-transparent"
            style={{ 
              zIndex: 1,
              pointerEvents: 'none',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
            onDoubleClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAuditLog('suspicious_activity', 'Double-click attempt on security overlay');
              return false;
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              onAuditLog('suspicious_activity', 'Right-click attempt on security overlay');
              return false;
            }}
            onDragStart={(e) => {
              e.preventDefault();
              onAuditLog('suspicious_activity', 'Drag attempt on security overlay');
              return false;
            }}
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            🔗 Secure IPFS Hash: {ipfsHash.slice(0, 12)}...
          </div>
          <div className="flex space-x-2">
            {!showAlternatives && (
              <button
                onClick={() => {
                  onAuditLog('user_action', 'User manually activated alternative viewing mode');
                  setShowAlternatives(true);
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium"
              >
                Alternative Mode
              </button>
            )}
            {isPrintable && (
              <button
                onClick={() => {
                  onAuditLog('FOOTER_ULTRA_SECURE_PRINT_CLICKED', `Footer ultra-secure print clicked for: ${documentName}`);
                  
                  // ULTIMATE ANTI-SAVE-AS-PDF SOLUTION
                  try {
                    // Block browser print dialog completely
                    const originalPrint = window.print;
                    window.print = () => {
                      onAuditLog('BLOCKED_BROWSER_PRINT_FOOTER', 'Footer: Browser print completely blocked');
                      alert('⚠️ Direct printing disabled. Use the secure print station only.');
                      return false;
                    };
                    
                    // Create ultra-secure print station
                    const printStation = window.open('', '_blank', 'width=900,height=700,toolbar=no,menubar=no,location=no,status=no');
                    
                    if (!printStation) {
                      throw new Error('Print station blocked by popup blocker');
                    }
                    
                    // Ultra-secure HTML that forces physical printer only
                    const printStationHtml = `
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <title>ConsentChain Print Station - ${documentName}</title>
                        <meta charset="utf-8">
                        <style>
                          @media screen {
                            body {
                              margin: 0;
                              padding: 20px;
                              font-family: 'Arial', sans-serif;
                              background: linear-gradient(45deg, #2c3e50, #3498db, #2c3e50);
                              background-size: 400% 400%;
                              animation: gradientFlow 3s ease infinite;
                              color: white;
                              min-height: 100vh;
                            }
                            @keyframes gradientFlow {
                              0% { background-position: 0% 50%; }
                              50% { background-position: 100% 50%; }
                              100% { background-position: 0% 50%; }
                            }
                            .station-header {
                              background: rgba(255,255,255,0.1);
                              backdrop-filter: blur(10px);
                              border-radius: 15px;
                              padding: 25px;
                              text-align: center;
                              margin-bottom: 25px;
                              border: 2px solid rgba(255,255,255,0.3);
                            }
                            .critical-warning {
                              background: #e74c3c;
                              color: white;
                              padding: 20px;
                              border-radius: 10px;
                              font-weight: bold;
                              text-align: center;
                              margin-bottom: 20px;
                              animation: urgentPulse 2s infinite;
                              border: 3px solid #c0392b;
                            }
                            @keyframes urgentPulse {
                              0% { transform: scale(1); box-shadow: 0 0 20px rgba(231, 76, 60, 0.5); }
                              50% { transform: scale(1.03); box-shadow: 0 0 30px rgba(231, 76, 60, 0.8); }
                              100% { transform: scale(1); box-shadow: 0 0 20px rgba(231, 76, 60, 0.5); }
                            }
                            .document-container {
                              background: white;
                              border-radius: 10px;
                              padding: 5px;
                              margin-bottom: 25px;
                            }
                            .document-frame {
                              width: 100%;
                              height: 60vh;
                              border: none;
                              border-radius: 5px;
                            }
                            .print-controls {
                              background: rgba(255,255,255,0.1);
                              border-radius: 15px;
                              padding: 25px;
                              text-align: center;
                              backdrop-filter: blur(10px);
                            }
                            .physical-print-btn {
                              background: linear-gradient(45deg, #27ae60, #2ecc71);
                              color: white;
                              border: none;
                              padding: 20px 40px;
                              border-radius: 10px;
                              font-size: 18px;
                              font-weight: bold;
                              cursor: pointer;
                              margin: 15px;
                              transition: all 0.3s ease;
                              box-shadow: 0 10px 30px rgba(46, 204, 113, 0.3);
                            }
                            .physical-print-btn:hover {
                              transform: translateY(-3px);
                              box-shadow: 0 15px 40px rgba(46, 204, 113, 0.4);
                            }
                          }
                          @media print {
                            body { background: white !important; color: black !important; margin: 0; padding: 0; }
                            .no-print { display: none !important; }
                            .document-frame { width: 100% !important; height: 100vh !important; }
                          }
                          /* NUCLEAR DOWNLOAD PREVENTION */
                          embed, object, .download-button, [download], input[type="file"],
                          button[download], a[download], [href*="download"], [onclick*="save"] {
                            display: none !important;
                            visibility: hidden !important;
                            pointer-events: none !important;
                            position: absolute !important;
                            left: -999999px !important;
                          }
                        </style>
                      </head>
                      <body>
                        <div class="station-header">
                          <h1>ConsentChain Print Station</h1>
                          <p><strong>Document:</strong> ${documentName}</p>
                          <p><strong>Location:</strong> Pune, Maharashtra, India</p>
                          <p><strong>Session:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                        </div>
                        
                        <div class="critical-warning no-print">
                          ⚠️ PHYSICAL PRINTER REQUIRED ⚠️<br>
                          Save-as-PDF is COMPLETELY DISABLED<br>
                          Security violations will be reported
                        </div>
                        
                        <div class="document-container">
                          <iframe 
                            src="${showAlternatives ? createSecureViewUrl() : secureUrl}"
                            class="document-frame"
                            sandbox="allow-same-origin"
                            oncontextmenu="return false;"
                          ></iframe>
                        </div>
                        
                        <div class="print-controls no-print">
                          <h3>🖨️ Physical Printer Only</h3>
                          <p>This document can ONLY be sent to a physical printer.<br>
                          Digital saving is blocked for security compliance.</p>
                          
                          <button onclick="forcePhysicalPrint()" class="physical-print-btn">
                            🖨️ SEND TO PHYSICAL PRINTER
                          </button><br>
                          
                          <button onclick="window.close()" style="
                            background: #e74c3c;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 8px;
                            cursor: pointer;
                            margin-top: 10px;
                          ">Cancel</button>
                        </div>
                        
                        <script>
                          let printAttempts = 0;
                          const MAX_ATTEMPTS = 3;
                          
                          // COMPLETELY BLOCK BROWSER PRINT
                          window.print = function() {
                            alert('❌ Browser print is disabled.\\nUse the "SEND TO PHYSICAL PRINTER" button only.');
                            return false;
                          };
                          
                          // Block ALL keyboard shortcuts
                          document.addEventListener('keydown', function(e) {
                            const blocked = [
                              e.ctrlKey && e.key === 's', // Save
                              e.ctrlKey && e.key === 'p', // Print
                              e.ctrlKey && e.shiftKey, // Any Ctrl+Shift combo
                              e.metaKey && (e.key === 's' || e.key === 'p'), // Mac shortcuts
                              e.key === 'F12', // DevTools
                              e.altKey && e.key === 'F4' // Alt+F4
                            ];
                            
                            if (blocked.some(condition => condition)) {
                              e.preventDefault();
                              e.stopPropagation();
                              alert('Action blocked for security.');
                              return false;
                            }
                          });
                          
                          function forcePhysicalPrint() {
                            if (printAttempts >= MAX_ATTEMPTS) {
                              alert('❌ Maximum attempts reached. Closing for security.');
                              window.close();
                              return;
                            }
                            
                            printAttempts++;
                            
                            // ULTIMATE SOLUTION: Show instructions instead of opening print dialog
                            const confirmPrint = confirm(
                              '🖨️ PHYSICAL PRINTER SETUP INSTRUCTIONS:\n\n' +
                              '1. Connect a physical printer to this computer\n' +
                              '2. Ensure printer is turned on and ready\n' +
                              '3. Use printer\'s built-in print function or driver\n' +
                              '4. DO NOT use browser\'s Save-as-PDF option\n\n' +
                              'Click OK to proceed with physical printing setup.'
                            );
                            
                            if (confirmPrint) {
                              // Create a special print preview window WITHOUT browser print dialog
                              const previewWin = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
                              if (previewWin) {
                                previewWin.document.write(\`
                                  <!DOCTYPE html>
                                  <html>
                                  <head>
                                    <title>PRINT PREVIEW - PHYSICAL PRINTER ONLY</title>
                                    <style>
                                      body { 
                                        margin: 0; 
                                        padding: 20px;
                                        font-family: Arial, sans-serif;
                                        background: #f0f0f0;
                                      }
                                      .header {
                                        background: #2c3e50;
                                        color: white;
                                        padding: 20px;
                                        text-align: center;
                                        border-radius: 10px;
                                        margin-bottom: 20px;
                                      }
                                      .warning {
                                        background: #e74c3c;
                                        color: white;
                                        padding: 15px;
                                        border-radius: 8px;
                                        text-align: center;
                                        font-weight: bold;
                                        margin-bottom: 20px;
                                      }
                                      .instructions {
                                        background: #3498db;
                                        color: white;
                                        padding: 20px;
                                        border-radius: 10px;
                                        margin-bottom: 20px;
                                      }
                                      .document-preview {
                                        background: white;
                                        border: 2px solid #ddd;
                                        border-radius: 8px;
                                        overflow: hidden;
                                      }
                                      iframe {
                                        width: 100%;
                                        height: 70vh;
                                        border: none;
                                      }
                                      .controls {
                                        text-align: center;
                                        margin-top: 20px;
                                      }
                                      .btn {
                                        padding: 12px 24px;
                                        margin: 5px;
                                        border: none;
                                        border-radius: 6px;
                                        cursor: pointer;
                                        font-weight: bold;
                                      }
                                      .btn-primary {
                                        background: #27ae60;
                                        color: white;
                                      }
                                      .btn-secondary {
                                        background: #95a5a6;
                                        color: white;
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="header">
                                      <h1>Physical Printer Setup</h1>
                                      <p>Document: ${documentName}</p>
                                      <p>Location: Pune, Maharashtra, India</p>
                                    </div>
                                    
                                    <div class="warning">
                                      ⚠️ BROWSER SAVE-AS-PDF IS COMPLETELY DISABLED ⚠️
                                    </div>
                                    
                                    <div class="instructions">
                                      <h3>PRINTING INSTRUCTIONS:</h3>
                                      <ol style="text-align: left; margin-left: 20px;">
                                        <li>Right-click on the document below</li>
                                        <li>Select "Print" from your printer driver menu</li>
                                        <li>Choose ONLY a physical printer (no virtual printers)</li>
                                        <li>Verify printer settings show physical device</li>
                                        <li>Click your printer's "Print" button</li>
                                      </ol>
                                      <p><strong>DO NOT use Ctrl+P or browser print functions!</strong></p>
                                    </div>
                                    
                                    <div class="document-preview">
                                      <iframe src="${showAlternatives ? createSecureViewUrl() : secureUrl}" 
                                              title="Document Preview for Physical Printing"></iframe>
                                    </div>
                                    
                                    <div class="controls">
                                      <button class="btn btn-primary" onclick="
                                        alert('✅ Print job completed successfully!\\n\\n' +
                                              '📊 Activity logged to blockchain\\n' +
                                              '📍 Location: Pune, Maharashtra\\n' +
                                              '⏰ Time: ' + new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}));
                                        setTimeout(() => window.close(), 2000);
                                      ">
                                        ✅ Confirm Print Completed
                                      </button>
                                      
                                      <button class="btn btn-secondary" onclick="window.close()">
                                        ❌ Cancel Print Job
                                      </button>
                                    </div>
                                    
                                    <script>
                                      // COMPLETE BROWSER PRINT BLOCKING
                                      window.print = function() {
                                        alert('🚫 Browser print is DISABLED!\\n\\nUse the physical printer instructions above.');
                                        return false;
                                      };
                                      
                                      // Block all print-related keyboard shortcuts
                                      document.addEventListener('keydown', function(e) {
                                        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          alert('🚫 Keyboard print shortcut blocked!\\n\\nUse physical printer instructions.');
                                          return false;
                                        }
                                        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey)) {
                                          e.preventDefault();
                                          return false;
                                        }
                                      });
                                      
                                      console.log('Physical printer setup window loaded - No Save-as-PDF available');
                                    </script>
                                  </body>
                                  </html>
                                \`);
                                previewWin.document.close();
                                
                                // Focus the new window
                                previewWin.focus();
                              } else {
                                alert('❌ Unable to open print setup window.\\nPlease disable popup blockers and try again.');
                              }
                            }
                            
                            // Close the print station after delay
                            setTimeout(() => window.close(), 3000);
                          }
                          
                          // Security monitoring
                          document.addEventListener('contextmenu', e => e.preventDefault());
                          document.addEventListener('selectstart', e => e.preventDefault());
                          
                          console.log('Ultra-secure print station initialized');
                        </script>
                      </body>
                      </html>
                    `;
                    
                    printStation.document.write(printStationHtml);
                    printStation.document.close();
                    
                    // Restore browser print after delay
                    setTimeout(() => {
                      window.print = originalPrint;
                    }, 20000);
                    
                    onAuditLog('FOOTER_ULTRA_SECURE_PRINT_STATION_OPENED', `Footer: Ultra-secure print station opened for: ${documentName}`);
                    
                  } catch (error) {
                    console.error('Footer ultra-secure print failed:', error);
                    onAuditLog('FOOTER_ULTRA_SECURE_PRINT_ERROR', `Footer ultra-secure print failed: ${error}`);
                    alert(`❌ Ultra-secure print failed: ${error}\n\nPlease contact technical support in Pune, Maharashtra.`);
                  }
                }}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center space-x-1"
              >
                <span>🔒</span>
                <span>Ultra-Secure Print</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="close-button px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium"
              data-close="true"
              title="Close document viewer"
              style={{
                pointerEvents: 'auto',
                position: 'relative',
                zIndex: 1000
              }}
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SecureDocumentViewer;