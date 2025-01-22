import { useState, useCallback } from 'react';

export const useLoadingState = (initialState = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialState);
  const [errors, setErrors] = useState({});

  const setLoading = useCallback((key, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [key]: isLoading }));
  }, []);

  const setError = useCallback((key, error) => {
    setErrors(prev => ({ ...prev, [key]: error }));
  }, []);

  const clearError = useCallback((key) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[key];
      return newErrors;
    });
  }, []);

  return {
    loadingStates,
    errors,
    setLoading,
    setError,
    clearError
  };
};