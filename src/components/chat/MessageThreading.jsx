import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Toaster, toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';

const MessageThreading = ({ messages, onDeleteMessage, onEditMessage }) => {
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleEditMessage = async (messageId, content) => {
    try {
      await onEditMessage(messageId, content);
      toast({
        title: "Message updated",
        description: "Your message has been successfully edited",
        variant: "success",
      });
      setEditingMessage(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to edit message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await onDeleteMessage(messageId);
      toast({
        title: "Message deleted",
        description: "Your message has been removed",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderMessage = (message) => {
    const isEditing = editingMessage === message.id;

    const MessageWrapper = ({ children }) => (
      <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className="max-w-[70%] bg-white rounded-lg shadow p-3 relative group">
          {children}
          {message.type === 'text' && (
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                onClick={() => {
                  setEditingMessage(message.id);
                  setEditContent(message.content);
                }}
                variant="ghost"
                size="icon"
                className="p-1 rounded-full bg-blue-100 hover:bg-blue-200"
                aria-label="Edit message"
              >
                <Edit className="h-4 w-4 text-blue-500" />
              </Button>
              <Button
                onClick={() => handleDeleteMessage(message.id)}
                variant="ghost"
                size="icon"
                className="p-1 rounded-full bg-red-100 hover:bg-red-200"
                aria-label="Delete message"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            {new Date(message.timestamp).toLocaleTimeString()}
            {message.edited && <span>(edited)</span>}
          </div>
        </div>
      </div>
    );

    switch (message.type) {
      case 'text':
        return (
          <MessageWrapper>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Edit message"
                  autoFocus
                />
                <Button
                  onClick={() => {
                    if (editContent.trim()) {
                      handleEditMessage(message.id, editContent.trim());
                    }
                  }}
                  variant="default"
                  size="sm"
                  className="bg-blue-500 text-white"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setEditingMessage(null)}
                  variant="secondary"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <p className="text-gray-800">{message.content}</p>
            )}
          </MessageWrapper>
        );
      case 'voice':
        return (
          <MessageWrapper>
            <audio 
              controls 
              src={URL.createObjectURL(message.content)}
              className="max-w-full"
              preload="metadata"
              onLoadedMetadata={(e) => {
                const cleanup = () => {
                  URL.revokeObjectURL(e.target.src);
                  e.target.removeEventListener('ended', cleanup);
                };
                e.target.addEventListener('ended', cleanup);
              }}
            />
          </MessageWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <div key={message.id}>
            {renderMessage(message)}
          </div>
        ))}
      </div>
    </>
  );
};

export default MessageThreading;