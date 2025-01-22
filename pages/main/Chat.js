import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Chat = () => {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  
  const sendMessage = (e) => {
    e.preventDefault();
    // Implement send message logic
    setMessage('');
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b p-4 flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={`/avatars/${id}.jpg`} />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">User Name</h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Message 
          text="Hey, how are you?"
          isSent={false}
          timestamp="09:30 AM"
        />
        <Message 
          text="I'm good, thanks! How about you?"
          isSent={true}
          timestamp="09:31 AM"
        />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

// Message Component
const Message = ({ text, isSent, timestamp }) => (
  <div className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[70%] rounded-lg p-3 ${
      isSent ? 'bg-blue-600 text-white' : 'bg-white border'
    }`}>
      <p>{text}</p>
      <p className={`text-xs mt-1 ${
        isSent ? 'text-blue-100' : 'text-gray-500'
      }`}>
        {timestamp}
      </p>
    </div>
  </div>
);

export default Chat;