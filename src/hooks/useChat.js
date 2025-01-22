export const useChat = () => {
    const { state, dispatch } = useContext(ChatContext);
    const { sendMessage, searchMessages, handleAttachment } = useChatActions();
    const { settings, updateSettings } = useChatSettings();
    const { notifications, clearNotification } = useNotifications();
  
    useEffect(() => {
      // Initialize websocket connection for real-time updates
      const ws = new WebSocket(process.env.REACT_APP_WS_URL);
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'NEW_MESSAGE':
            dispatch({ type: 'ADD_MESSAGE', payload: data.message });
            break;
          case 'USER_STATUS':
            // Update user status in chat list
            dispatch({
              type: 'SET_CHATS',
              payload: state.chats.map(chat => 
                chat.id === data.userId 
                  ? { ...chat, isOnline: data.status }
                  : chat
              )
            });
            break;
          // Add other websocket event handlers
        }
      };
  
      return () => ws.close();
    }, []);
  
    return {
      state,
      sendMessage,
      searchMessages,
      handleAttachment,
      settings,
      updateSettings,
      notifications,
      clearNotification
    };
  };