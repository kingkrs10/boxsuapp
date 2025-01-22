// src/navigation/AppNavigator.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '../../screens/SplashScreen';
import { navigationRef } from './navigationRef';
import { navigationTheme } from './navigationTheme';
import { StatusBar } from 'react-native';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading, initialized } = useAuth();

  useEffect(() => {
    if (initialized) {
      // Perform any initialization logic here
      StatusBar.setBarStyle('dark-content');
    }
  }, [initialized]);

  if (!initialized || loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
        cardOverlayEnabled: true,
        cardStyleInterpolator: ({ current: { progress } }) => ({
          cardStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 0.5, 0.9, 1],
              outputRange: [0, 0.25, 0.7, 1],
            }),
          },
          overlayStyle: {
            opacity: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
              extrapolate: 'clamp',
            }),
          },
        }),
      }}>
        {user ? (
          <Stack.Screen 
            name="Main" 
            component={MainNavigator}
            options={{ gestureEnabled: false }}
          />
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{ gestureEnabled: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}