import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import ChatService from '../../services/ChatService';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const MESSAGES_PER_PAGE = 20;

const ChatWrapper = ({ route }) => {
  const { chatId } = route.params;
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const lastMessageRef = useRef(null);
  
  useEffect(() => {
    let messagesUnsubscribe;
    let typingUnsubscribe;

    const setupSubscriptions = async () => {
      try {
        // Subscribe to real-time messages
        messagesUnsubscribe = ChatService.subscribeToMessages(
          chatId,
          MESSAGES_PER_PAGE,
          (updatedMessages) => {
            setMessages(updatedMessages);
            if (isInitialLoading) setIsInitialLoading(false);
          }
        );

        // Subscribe to typing indicators
        typingUnsubscribe = ChatService.subscribeToTypingIndicators(
          chatId,
          (updates) => {
            setTypingUsers(updates);
          }
        );

      } catch (error) {
        console.error('Error setting up chat subscriptions:', error);
        setIsInitialLoading(false);
      }
    };

    setupSubscriptions();

    return () => {
      if (messagesUnsubscribe) messagesUnsubscribe();
      if (typingUnsubscribe) typingUnsubscribe();
    };
  }, [chatId]);

  const handleLoadMore = useCallback(async () => {
    if (!hasMoreMessages || isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const oldestMessageId = messages[messages.length - 1]?.id;
      
      const olderMessages = await ChatService.loadMoreMessages(
        chatId,
        oldestMessageId,
        MESSAGES_PER_PAGE
      );

      if (olderMessages.length < MESSAGES_PER_PAGE) {
        setHasMoreMessages(false);
      }

      setMessages(prevMessages => [...prevMessages, ...olderMessages]);
    } catch (error) {
      console.error('Error loading more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [chatId, messages, hasMoreMessages, isLoadingMore]);

  const handleSendMessage = useCallback(async (content, type = 'text') => {
    try {
      const newMessage = await ChatService.sendMessage(chatId, user.uid, content, type);
      
      // Optimistically add message to state
      setMessages(prevMessages => [newMessage, ...prevMessages]);
      
      // Reset typing indicator after sending
      await handleTypingIndicator(false);
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove optimistically added message on error
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== newMessage.id)
      );
    }
  }, [chatId, user]);

  const handleTypingIndicator = useCallback(async (isTyping) => {
    try {
      await ChatService.setTypingIndicator(chatId, user.uid, isTyping);
    } catch (error) {
      console.error('Error updating typing indicator:', error);
    }
  }, [chatId, user]);

  const handleReaction = useCallback(async (messageId, reaction) => {
    try {
      await ChatService.addReaction(messageId, user.uid, reaction);
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  }, [user]);

  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      await ChatService.deleteMessage(messageId);
      // Optimistically remove message from state
      setMessages(prevMessages => 
        prevMessages.filter(msg => msg.id !== messageId)
      );
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  }, []);

  const handleEditMessage = useCallback(async (messageId, newContent) => {
    try {
      await ChatService.editMessage(messageId, newContent);
      // Optimistically update message in state
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId
            ? { ...msg, content: newContent, edited: true }
            : msg
        )
      );
    } catch (error) {
      console.error('Error editing message:', error);
    }
  }, []);

  if (isInitialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MessageList
        messages={messages}
        currentUserId={user.uid}
        onReaction={handleReaction}
        onDeleteMessage={handleDeleteMessage}
        onEditMessage={handleEditMessage}
        onLoadMore={handleLoadMore}
        isLoadingMore={isLoadingMore}
        hasMoreMessages={hasMoreMessages}
      />
      <TypingIndicator users={typingUsers} />
      <MessageInput
        onSend={handleSendMessage}
        onTyping={handleTypingIndicator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ChatWrapper;