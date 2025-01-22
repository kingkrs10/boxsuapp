import React, { useState } from 'react';
import { NotificationSoundProvider } from './components/common/NotificationSound';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import ChatDetail from './components/chat/ChatDetail';
import { Button } from '@/components/ui/button';

// Mock data
const mockCurrentUser = {
  id: 'user1',
  name: 'John Doe',
  avatar: '/api/placeholder/32/32'
};

const mockChat = {
  id: 'chat1',
  name: 'Jane Smith',
  avatar: '/api/placeholder/32/32',
  isOnline: true,
  messages: [
    {
      id: 'm1',
      sender: 'user1',
      text: 'Thanks for your message!',
      timestamp: new Date().toISOString()
    }
  ]
};

const handleSendMessage = (message) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const responseMessage = {
        id: `m${Date.now()}`,
        sender: 'user2',
        text: message,
        timestamp: new Date().toISOString()
      };
      resolve(responseMessage);
    }, 500);
  });
};

const ChatDemo = () => {
  const [chat, setChat] = useState(mockChat);
  const [settings, setSettings] = useState({ sound: true });
  const [shouldError, setShouldError] = useState(false);

  return (
    <div className="h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="mb-4 space-y-2">
          <h1 className="text-2xl font-bold">Chat App Demo</h1>
          
          <div className="space-x-2">
            <Button
              onClick={() => setSettings(prev => ({
                ...prev,
                sound: !prev.sound
              }))}
              variant={settings.sound ? "default" : "secondary"}
            >
              {settings.sound ? 'Sound On' : 'Sound Off'}
            </Button>
            
            <Button
              onClick={() => setShouldError(!shouldError)}
              variant={shouldError ? "destructive" : "outline"}
            >
              {shouldError ? 'Error Mode On' : 'Error Mode Off'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg h-[600px]">
          <ErrorBoundary>
            <NotificationSoundProvider>
              <ChatDetail
                chat={chat}
                currentUser={mockCurrentUser}
                sendMessage={async (message) => {
                  if (shouldError) {
                    throw new Error('Simulated error sending message');
                  }

                  const response = await handleSendMessage(message);
                  setChat(prev => ({
                    ...prev,
                    messages: [...prev.messages, response]
                  }));
                }}
                settings={settings}
              />
            </NotificationSoundProvider>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default ChatDemo;