// src/navigation/NavigationService.js
import { createRef } from 'react';
import { StackActions } from '@react-navigation/native';

export const navigationRef = createRef();

class NavigationService {
  navigate(name, params) {
    if (navigationRef.current) {
      navigationRef.current.navigate(name, params);
    }
  }

  push(name, params) {
    if (navigationRef.current) {
      navigationRef.current.dispatch(StackActions.push(name, params));
    }
  }

  goBack() {
    if (navigationRef.current) {
      navigationRef.current.goBack();
    }
  }

  reset(routes, index = 0) {
    if (navigationRef.current) {
      navigationRef.current.reset({
        index,
        routes,
      });
    }
  }

  getCurrentRoute() {
    if (navigationRef.current) {
      return navigationRef.current.getCurrentRoute();
    }
    return null;
  }

  // Helper method for resetting to a specific screen
  resetToScreen(screenName, params = {}) {
    this.reset([{ name: screenName, params }]);
  }

  // Helper method for handling auth navigation
  navigateAfterAuth() {
    this.resetToScreen('MainApp');
  }

  // Helper method for handling logout
  navigateToAuth() {
    this.resetToScreen('Login');
  }
}

export default new NavigationService();