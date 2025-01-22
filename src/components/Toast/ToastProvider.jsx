// src/components/common/Toast/ToastProvider.jsx
import React, { createContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeout = useRef(null);
  const insets = useSafeAreaInsets();

  const hideToast = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setToast(null);
    });
  }, [fadeAnim]);

  const showToast = useCallback(
    (message, type = TOAST_TYPES.INFO, duration = 3000) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }

      fadeAnim.setValue(0);
      setToast({ message, type });

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      timeout.current = setTimeout(hideToast, duration);
    },
    [fadeAnim, hideToast]
  );

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  const getToastStyle = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return styles.successToast;
      case TOAST_TYPES.ERROR:
        return styles.errorToast;
      case TOAST_TYPES.WARNING:
        return styles.warningToast;
      default:
        return styles.infoToast;
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case TOAST_TYPES.SUCCESS:
        return '✓';
      case TOAST_TYPES.ERROR:
        return '⨯';
      case TOAST_TYPES.WARNING:
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <Animated.View
          style={[
            styles.toastContainer,
            getToastStyle(toast.type),
            { opacity: fadeAnim },
            { top: insets.top + 10 },
          ]}
        >
          <View style={styles.toastContent}>
            <Text style={styles.icon}>{getIconForType(toast.type)}</Text>
            <Text style={styles.message}>{toast.message}</Text>
          </View>
          <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 18,
    marginRight: 8,
  },
  message: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
  closeText: {
    fontSize: 20,
    color: '#666',
    lineHeight: 20,
  },
  successToast: {
    backgroundColor: '#E7F7EF',
    borderLeftColor: '#34C759',
    borderLeftWidth: 4,
  },
  errorToast: {
    backgroundColor: '#FFE5E5',
    borderLeftColor: '#FF3B30',
    borderLeftWidth: 4,
  },
  warningToast: {
    backgroundColor: '#FFF9E6',
    borderLeftColor: '#FFD60A',
    borderLeftWidth: 4,
  },
  infoToast: {
    backgroundColor: '#E5F1FF',
    borderLeftColor: '#007AFF',
    borderLeftWidth: 4,
  },
});