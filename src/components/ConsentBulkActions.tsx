import React from 'react';

interface ConsentBulkActionsProps {
  selected: string[];
  onApprove: () => void;
  onRevoke: () => void;
}

const ConsentBulkActions: React.FC<ConsentBulkActionsProps> = ({ selected, onApprove, onRevoke }) => {
  if (selected.length === 0) return null;

  return (
    <div className="bg-white p-4 border-b">
      <span className="text-sm text-gray-500 mr-4">
        {selected.length} item(s) selected
      </span>
      <button
        onClick={onApprove}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
      >
        Approve Selected
      </button>
      <button
        onClick={onRevoke}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Revoke Selected
      </button>
    </div>
  );
};

export default ConsentBulkActions;