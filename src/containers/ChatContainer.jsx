import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import {
  ChatDetail,
  GroupChat,
  ChatSearch,
  ChatSettings,
  UserProfile,
  MessageAttachments,
  NotificationSettings
} from '../components/chat';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ChatContainer = () => {
  const {
    state,
    sendMessage,
    searchMessages,
    handleAttachment,
    settings,
    updateSettings,
    notifications,
    clearNotification
  } = useChat();

  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

  // Handle user interactions
  const handleMessageSend = async (message) => {
    if (state.currentChat) {
      await sendMessage(state.currentChat.id, message);
    }
  };

  const handleSearch = (query) => {
    searchMessages(query);
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    for (const file of files) {
      await handleAttachment(file);
    }
  };

  const handleNotificationClick = (notification) => {
    // Navigate to relevant chat/message
    if (notification.type === 'message') {
      // Set current chat and scroll to message
    }
    clearNotification(notification.id);
  };

  return (
    <div className="flex h-screen">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Active Chat */}
        {state.currentChat ? (
          <>
            <ChatSearch onSearch={handleSearch} />
            {state.currentChat.type === 'group' ? (
              <GroupChat
                group={state.currentChat}
                members={state.currentChat.members}
                onAddMember={() => {/* Handle add member */}}
                onSettings={() => setShowSettings(true)}
              />
            ) : (
              <ChatDetail
                chat={state.currentChat}
                sendMessage={handleMessageSend}
                currentUser={state.currentUser}
                onProfileClick={() => setShowProfile(true)}
                onAttachmentClick={() => setShowAttachments(true)}
              />
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a chat to start messaging</p>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            className="cursor-pointer"
            onClick={() => handleNotificationClick(notification)}
          >
            <AlertDescription>
              {notification.content}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Modals/Dialogs */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent>
          <UserProfile
            user={state.currentChat}
            isContact={true}
            onAddContact={() => {/* Handle add contact */}}
            onBlock={() => {/* Handle block user */}}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <Tabs defaultValue="chat">
            <TabsList>
              <TabsTrigger value="chat">Chat Settings</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="chat">
              <ChatSettings
                chat={state.currentChat}
                onUpdateSettings={updateSettings}
                onLeaveChat={() => {/* Handle leave chat */}}
                onBlockUser={() => {/* Handle block user */}}
              />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationSettings
                settings={settings}
                onUpdateSettings={updateSettings}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showAttachments} onOpenChange={setShowAttachments}>
        <DialogContent>
          <MessageAttachments
            attachments={state.attachments}
            onUpload={handleFileUpload}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatContainer;