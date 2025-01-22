import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ChatContext = createContext();

const initialState = {
  chats: [],
  currentChat: null,
  messages: [],
  searchQuery: '',
  notifications: [],
  attachments: [],
  settings: {
    messageNotifications: true,
    groupNotifications: true,
    sound: true
  }
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
    case 'SET_CURRENT_CHAT':
      return { ...state, currentChat: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'CLEAR_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
    case 'ADD_ATTACHMENT':
      return {
        ...state,
        attachments: [...state.attachments, action.payload]
      };
    case 'REMOVE_ATTACHMENT':
      return {
        ...state,
        attachments: state.attachments.filter((_, index) => index !== action.payload)
      };
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

// Custom hooks for chat functionality
export const useChatActions = () => {
  const { dispatch } = useContext(ChatContext);
  
  const sendMessage = async (chatId, message) => {
    try {
      // API call to send message
      const response = await fetch('/api/messages', {
        method: 'POST',
        body: JSON.stringify({ chatId, message })
      });
      const newMessage = await response.json();
      
      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
      
      // Handle notifications if enabled
      if (state.settings.messageNotifications) {
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            id: Date.now(),
            type: 'message',
            content: `New message: ${message.slice(0, 30)}...`
          }
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const searchMessages = async (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    if (query.trim()) {
      try {
        const response = await fetch(`/api/messages/search?q=${query}`);
        const results = await response.json();
        dispatch({ type: 'SET_MESSAGES', payload: results });
      } catch (error) {
        console.error('Error searching messages:', error);
      }
    }
  };

  const handleAttachment = async (file) => {
    try {
      // Handle file upload
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/attachments', {
        method: 'POST',
        body: formData
      });
      
      const attachment = await response.json();
      dispatch({ type: 'ADD_ATTACHMENT', payload: attachment });
    } catch (error) {
      console.error('Error uploading attachment:', error);
    }
  };

  return {
    sendMessage,
    searchMessages,
    handleAttachment
  };
};

// Hook for managing chat settings
export const useChatSettings = () => {
  const { state, dispatch } = useContext(ChatContext);

  const updateSettings = (newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };

  return {
    settings: state.settings,
    updateSettings
  };
};

// Hook for managing notifications
export const useNotifications = () => {
  const { state, dispatch } = useContext(ChatContext);

  const clearNotification = (notificationId) => {
    dispatch({ type: 'CLEAR_NOTIFICATION', payload: notificationId });
  };

  return {
    notifications: state.notifications,
    clearNotification
  };
};