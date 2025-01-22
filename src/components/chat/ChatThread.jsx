import React, { useState } from 'react';
import { X } from 'lucide-react';
import MessageItem from './MessageItem';
import MessageInput from './MessageInput';

const ChatThread = ({
  parentMessage,
  replies,
  currentUser,
  onClose,
  onSendReply,
  onReactionSelect
}) => {
  const [replyContent, setReplyContent] = useState('');

  const handleSendReply = (content) => {
    onSendReply(parentMessage.id, content);
    setReplyContent('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Thread Replies</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Original message */}
      <div className="p-4 bg-gray-50">
        <MessageItem
          message={parentMessage}
          currentUser={currentUser}
          showThreadButton={false}
          onReactionSelect={onReactionSelect}
        />
      </div>

      {/* Replies */}
      <div className="flex-1 overflow-y-auto p-4">
        {replies.map((reply, index) => (
          <div key={reply.id} className="mb-4">
            <MessageItem
              message={reply}
              previousMessage={replies[index - 1]}
              currentUser={currentUser}
              showThreadButton={false}
              onReactionSelect={onReactionSelect}
            />
          </div>
        ))}
      </div>

      {/* Reply input */}
      <div className="p-4 border-t">
        <MessageInput
          onSend={handleSendReply}
          placeholder="Reply to thread..."
        />
      </div>
    </div>
  );
};

export default ChatThread;