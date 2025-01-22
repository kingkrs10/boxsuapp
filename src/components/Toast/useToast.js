// src/components/common/Toast/useToast.js
import { useContext } from 'react';
import { ToastContext, TOAST_TYPES } from './ToastProvider';

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

// Re-export TOAST_TYPES for convenience
export { TOAST_TYPES };