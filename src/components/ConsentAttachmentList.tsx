import React from 'react';

interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface ConsentAttachmentListProps {
  attachments: Attachment[];
}

const ConsentAttachmentList: React.FC<ConsentAttachmentListProps> = ({ attachments }) => {
  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div key={attachment.id} className="flex items-center p-2 bg-gray-50 rounded">
          <span className="flex-1">{attachment.name}</span>
          <span className="text-sm text-gray-500">{attachment.size}</span>
        </div>
      ))}
    </div>
  );
};

export default ConsentAttachmentList;