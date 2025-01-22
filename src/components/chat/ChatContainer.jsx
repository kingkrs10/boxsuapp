import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import { useToast } from '../common/Toast/useToast';
import ChatService from '../../services/ChatService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import ThreadView from './ThreadView';
import LoadingSpinner from '../common/LoadingSpinner';

const ChatContainer = ({ route }) => {
  const { chatId } = route.params;
  const { user } = useAuth();
  const showToast = useToast();
  
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeThread, setActiveThread] = useState(null);
  const [threadReplies, setThreadReplies] = useState({});

  useEffect(() => {
    let messagesUnsubscribe;
    let typingUnsubscribe;
    let threadUnsubscribe;

    const setupSubscriptions = async () => {
      try {
        // Subscribe to messages
        messagesUnsubscribe = ChatService.subscribeToMessages(
          chatId,
          (updatedMessages) => {
            setMessages(updatedMessages);
            if (isLoading) setIsLoading(false);
          },
          showToast
        );

        // Subscribe to typing indicators
        typingUnsubscribe = ChatService.subscribeToTypingIndicators(
          chatId,
          (updates) => {
            setTypingUsers(updates);
          },
          showToast
        );

        // Subscribe to thread updates if there's an active thread
        if (activeThread) {
          threadUnsubscribe = ChatService.subscribeToThreadReplies(
            activeThread,
            (replies) => {
              setThreadReplies(prev => ({
                ...prev,
                [activeThread]: replies
              }));
            },
            showToast
          );
        }

      } catch (error) {
        console.error('Error setting up chat subscriptions:', error);
        showToast('Failed to connect to chat', 'error');
        setIsLoading(false);
      }
    };

    setupSubscriptions();

    return () => {
      if (messagesUnsubscribe) messagesUnsubscribe();
      if (typingUnsubscribe) typingUnsubscribe();
      if (threadUnsubscribe) threadUnsubscribe();
    };
  }, [chatId, activeThread, showToast]);

  const handleSendMessage = useCallback(async (content, type = 'text') => {
    try {
      await ChatService.sendMessage(chatId, user.uid, content, type, showToast);
      
      // Reset typing indicator after sending
      await handleTypingIndicator(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [chatId, user, showToast]);

  const handleTypingIndicator = useCallback(async (isTyping) => {
    try {
      await ChatService.setTypingIndicator(chatId, user.uid, isTyping, showToast);
    } catch (error) {
      console.error('Error updating typing indicator:', error);
    }
  }, [chatId, user, showToast]);

  const handleReaction = useCallback(async (messageId, reaction) => {
    try {
      await ChatService.addReaction(messageId, user.uid, reaction, showToast);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }, [user, showToast]);

  const handleThreadReply = useCallback(async (parentId, content) => {
    try {
      await ChatService.sendThreadReply(parentId, user.uid, content, showToast);
    } catch (error) {
      console.error('Error sending thread reply:', error);
    }
  }, [user, showToast]);

  const handleOpenThread = useCallback(async (messageId) => {
    setActiveThread(messageId);
    try {
      const replies = await ChatService.getThreadReplies(messageId);
      setThreadReplies(prev => ({
        ...prev,
        [messageId]: replies
      }));
    } catch (error) {
      console.error('Error fetching thread replies:', error);
      showToast('Failed to load thread replies', 'error');
    }
  }, [showToast]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {!activeThread ? (
        <>
          <MessageList
            messages={messages}
            currentUserId={user.uid}
            onReaction={handleReaction}
            onThreadPress={handleOpenThread}
          />
          <TypingIndicator users={typingUsers} />
          <MessageInput
            onSend={handleSendMessage}
            onTyping={handleTypingIndicator}
          />
        </>
      ) : (
        <ThreadView
          parentMessage={messages.find(m => m.id === activeThread)}
          replies={threadReplies[activeThread] || []}
          currentUserId={user.uid}
          onClose={() => setActiveThread(null)}
          onSendReply={handleThreadReply}
          onReaction={handleReaction}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ChatContainer;