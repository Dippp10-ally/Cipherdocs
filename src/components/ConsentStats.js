import React, { useState, useEffect } from 'react';
import { formatConsentRecord, isConsentExpired } from '../utils/consentHelpers';

/**
 * ConsentStats Component
 * Displays statistics and analytics for consent management
 */
const ConsentStats = ({ consentData = [] }) => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    pending: 0,
    granted: 0,
    revoked: 0
  });

  useEffect(() => {
    if (consentData.length > 0) {
      calculateStats();
    }
  }, [consentData]);

  const calculateStats = () => {
    const newStats = {
      total: consentData.length,
      active: 0,
      expired: 0,
      pending: 0,
      granted: 0,
      revoked: 0
    };

    consentData.forEach(consent => {
      const formattedConsent = formatConsentRecord(consent);
      
      if (formattedConsent.status === 'PENDING') {
        newStats.pending++;
      } else if (formattedConsent.status === 'GRANTED') {
        newStats.granted++;
        if (isConsentExpired(consent)) {
          newStats.expired++;
        } else {
          newStats.active++;
        }
      } else if (formattedConsent.status === 'REVOKED') {
        newStats.revoked++;
      }
    });

    setStats(newStats);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'expired':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'revoked':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const StatCard = ({ title, value, status, icon }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${getStatusColor(status)}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Consent Statistics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Consents"
            value={stats.total}
            status="default"
            icon={<span className="text-lg">📊</span>}
          />
          
          <StatCard
            title="Active Consents"
            value={stats.active}
            status="active"
            icon={<span className="text-lg">✅</span>}
          />
          
          <StatCard
            title="Pending Requests"
            value={stats.pending}
            status="pending"
            icon={<span className="text-lg">⏳</span>}
          />
          
          <StatCard
            title="Expired Consents"
            value={stats.expired}
            status="expired"
            icon={<span className="text-lg">⏰</span>}
          />
          
          <StatCard
            title="Granted Consents"
            value={stats.granted}
            status="active"
            icon={<span className="text-lg">🎯</span>}
          />
          
          <StatCard
            title="Revoked Consents"
            value={stats.revoked}
            status="revoked"
            icon={<span className="text-lg">❌</span>}
          />
        </div>
      </div>

      {/* Progress Bar for Active vs Expired */}
      {stats.granted > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Consent Health Overview
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Active Consents</span>
              <span>{Math.round((stats.active / stats.granted) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.active / stats.granted) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm">
              <span>Expired Consents</span>
              <span>{Math.round((stats.expired / stats.granted) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.expired / stats.granted) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsentStats; 