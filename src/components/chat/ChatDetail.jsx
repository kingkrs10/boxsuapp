import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Send, Paperclip, MoreVertical } from 'lucide-react';
import { Toaster, toast } from '@/components/ui/toast';
import { useNotificationSound } from './NotificationSound';
import { ChatErrorBoundary, MessageErrorBoundary } from './ErrorBoundary';

const ChatDetail = ({ chat, sendMessage, currentUser, settings }) => {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const { playMessageSound } = useMessageNotification(settings);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  // Play sound when new message arrives
  useEffect(() => {
    const lastMessage = chat?.messages?.[chat.messages.length - 1];
    if (lastMessage && lastMessage.sender !== currentUser.id) {
      playMessageSound();
    }
  }, [chat?.messages, currentUser.id, playMessageSound]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (messageText.trim() && !isSending) {
      setIsSending(true);
      try {
        await sendMessage(messageText);
        setMessageText('');
        toast({
          title: "Message sent",
          description: "Your message has been delivered",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <ChatErrorBoundary>
      <div className="flex flex-col h-screen">
        <Toaster />
        
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={chat?.avatar} />
              <AvatarFallback>{chat?.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{chat?.name}</h2>
              <p className="text-sm text-gray-500">
                {chat?.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Messages Area */}
        <MessageErrorBoundary>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chat?.messages?.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === currentUser.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === currentUser.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <p>{message.text}</p>
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </MessageErrorBoundary>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => {
                toast({
                  title: "Coming soon",
                  description: "This feature is not yet available",
                  variant: "default",
                });
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              onClick={() => {
                toast({
                  title: "Coming soon",
                  description: "Attachment feature is not yet available",
                  variant: "default",
                });
              }}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isSending}
            />
            <Button 
              type="submit" 
              disabled={!messageText.trim() || isSending}
              className={isSending ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </ChatErrorBoundary>
  );
};

export default ChatDetail;