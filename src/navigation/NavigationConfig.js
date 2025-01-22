// src/navigation/NavigationConfig.js
export const ROUTES = {
    // Auth Routes
    LOGIN: 'Login',
    HOME: 'Home',
    GROUPS: 'Groups',
    
    // Main App Routes
    MAIN_APP: 'MainApp',
    GROUP_CHAT: 'GroupChat',
    CHAT: 'Chat',
  };
  
  export const navigationRef = React.createRef();
  
  export const navigate = (name, params) => {
    navigationRef.current?.navigate(name, params);
  };
  
  export const reset = (routes, index = 0) => {
    navigationRef.current?.reset({
      index,
      routes,
    });
  };
  
  export const goBack = () => {
    navigationRef.current?.goBack();
  };