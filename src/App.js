// src/App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './contexts/AuthContext';
import SplashScreen from 'react-native-splash-screen';
import { navigationRef } from './navigation/NavigationService';
import { ToastProvider } from './components/common/Toast/ToastProvider';
import AppNavigator from './navigation/NavigationContainer';
import { NotificationSoundProvider } from './NotificationSound';

function App() {
  useEffect(() => {
    // Hide splash screen after components mount
    SplashScreen.hide();
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <NavigationContainer ref={navigationRef}>
        <NotificationSoundProvider>
          <AppNavigator />
          <YourApp />
          </NotificationSoundProvider>  
        </NavigationContainer>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;