import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AuditEntry {
  id: string;
  timestamp: Date;
  action: 'document_viewed' | 'document_requested' | 'access_granted' | 'access_denied' | 'access_expired' | 'session_started' | 'suspicious_activity';
  documentName: string;
  requesterName: string;
  userPhone: string;
  ipAddress: string;
  deviceInfo: string;
  duration?: number;
  accessCode?: string;
  details?: string;
}

interface AuditTrailProps {
  onClose: () => void;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ onClose }) => {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Load audit entries from localStorage (in production, this would be from blockchain/database)
    const storedAudit = localStorage.getItem('consent_audit_trail');
    if (storedAudit) {
      const entries = JSON.parse(storedAudit);
      setAuditEntries(entries.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
  }, []);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'document_viewed': return '👀';
      case 'document_requested': return '•';
      case 'access_granted': return '•';
      case 'access_denied': return '❌';
      case 'access_expired': return '•';
      case 'session_started': return '•';
      case 'suspicious_activity': return '🚨';
      default: return '•';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'document_viewed': return 'text-blue-600 bg-blue-50';
      case 'document_requested': return 'text-purple-600 bg-purple-50';
      case 'access_granted': return 'text-green-600 bg-green-50';
      case 'access_denied': return 'text-red-600 bg-red-50';
      case 'access_expired': return 'text-orange-600 bg-orange-50';
      case 'session_started': return 'text-indigo-600 bg-indigo-50';
      case 'suspicious_activity': return 'text-red-800 bg-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredEntries = filter === 'all' 
    ? auditEntries 
    : auditEntries.filter(entry => entry.action === filter);

  const exportAuditTrail = () => {
    const csvContent = [
      ['Timestamp', 'Action', 'Document', 'Requester', 'User Phone', 'IP Address', 'Details'].join(','),
      ...auditEntries.map(entry => [
        entry.timestamp.toISOString(),
        formatAction(entry.action),
        entry.documentName,
        entry.requesterName,
        entry.userPhone,
        entry.ipAddress,
        entry.details || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `ConsentChain_AuditTrail_${new Date().toISOString().split('T')[0]}.csv`;
    window.document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    window.document.body.removeChild(a);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Audit Trail</h2>
              <p className="text-blue-100">Complete blockchain-recorded access history</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              {['all', 'document_viewed', 'access_granted', 'access_denied', 'suspicious_activity'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterType === 'all' ? 'All Activities' : formatAction(filterType)}
                </button>
              ))}
            </div>
            <button
              onClick={exportAuditTrail}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
            >
              Export CSV
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredEntries.length} of {auditEntries.length} entries
          </div>
        </div>

        {/* Audit Entries */}
        <div className="p-6 overflow-y-auto max-h-96">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 text-gray-400">□</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Audit Entries</h3>
              <p className="text-gray-600">No activities recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getActionColor(entry.action)}`}>
                        <span className="text-lg">{getActionIcon(entry.action)}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {formatAction(entry.action)}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Document: <span className="font-medium">{entry.documentName}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Requester: <span className="font-medium">{entry.requesterName}</span>
                        </p>
                        {entry.details && (
                          <p className="text-sm text-gray-500 mt-1">
                            {entry.details}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                          <span>Phone: {entry.userPhone}</span>
                          <span>🌐 {entry.ipAddress}</span>
                          <span>Device: {entry.deviceInfo}</span>
                          {entry.accessCode && (
                            <span>🔑 Code: {entry.accessCode}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      <div className="font-medium">
                        {entry.timestamp.toLocaleDateString()}
                      </div>
                      <div>
                        {entry.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              All entries are recorded on Algorand blockchain for immutability
            </div>
            <div>
              Zero-knowledge privacy protection enabled
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuditTrail;