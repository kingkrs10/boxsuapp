import React, { createContext, useContext, useEffect, useRef } from 'react';
import Sound from 'react-native-sound';

// Enable playback in silence mode
Sound.setCategory('Playback');

const NotificationSoundContext = createContext();

export const NotificationSoundProvider = ({ children }) => {
  const soundRef = useRef(null);
  const settingsRef = useRef({
    sound: true,
    messageNotifications: true,
    groupNotifications: true
  });

  useEffect(() => {
    // Initialize sound
    const sound = new Sound('notification.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load sound', error);
        return;
      }
    });
    soundRef.current = sound;

    return () => {
      if (soundRef.current) {
        soundRef.current.release();
      }
    };
  }, []);

  const playNotification = (type = 'message') => {
    const settings = settingsRef.current;
    
    if (!settings.sound) return;
    if (type === 'message' && !settings.messageNotifications) return;
    if (type === 'group' && !settings.groupNotifications) return;

    try {
      if (soundRef.current) {
        soundRef.current.stop(() => {
          soundRef.current.play((success) => {
            if (!success) {
              console.log('Sound playback failed');
            }
          });
        });
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  };

  const updateSettings = (newSettings) => {
    settingsRef.current = {
      ...settingsRef.current,
      ...newSettings
    };
  };

  return (
    <NotificationSoundContext.Provider value={{ playNotification, updateSettings }}>
      {children}
    </NotificationSoundContext.Provider>
  );
};

export const useNotificationSound = () => {
  const context = useContext(NotificationSoundContext);
  if (!context) {
    throw new Error('useNotificationSound must be used within a NotificationSoundProvider');
  }
  return context;
};

export const useMessageNotification = (settings = {}) => {
  const { playNotification, updateSettings } = useNotificationSound();

  useEffect(() => {
    updateSettings(settings);
  }, [settings]);

  return {
    playMessageSound: () => playNotification('message'),
    playGroupSound: () => playNotification('group')
  };
};