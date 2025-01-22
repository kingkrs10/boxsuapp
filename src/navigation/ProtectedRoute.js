// src/navigation/ProtectedRoute.js
import React from 'react';
import { View } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Navigate to login if not authenticated
    // This should be handled by the main navigator, but this is a backup
    navigate(ROUTES.LOGIN);
    return null;
  }

  return children;
};

export default ProtectedRoute;