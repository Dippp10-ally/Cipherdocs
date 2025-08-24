import React from 'react';

const ConsentStatusLegend: React.FC = () => {
  const statuses = [
    { label: 'Pending', color: 'bg-yellow-500' },
    { label: 'Approved', color: 'bg-green-500' },
    { label: 'Denied', color: 'bg-red-500' },
    { label: 'Expired', color: 'bg-gray-500' }
  ];

  return (
    <div className="flex space-x-4">
      {statuses.map((status) => (
        <div key={status.label} className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${status.color}`} />
          <span className="text-sm text-gray-600">{status.label}</span>
        </div>
      ))}
    </div>
  );
};

export default ConsentStatusLegend;