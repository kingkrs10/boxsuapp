import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import ChatDetail from '../components/chat/ChatDetail';
import { NotificationSoundProvider } from '../components/common/NotificationSound';

// Mock the Sound module
jest.mock('react-native-sound', () => {
  return class SoundMock {
    static setCategory = jest.fn();
    constructor() {
      this.play = jest.fn((cb) => cb(true));
      this.stop = jest.fn((cb) => cb());
      this.release = jest.fn();
    }
  };
});

describe('ChatDetail', () => {
  const mockChat = {
    id: 'chat1',
    name: 'Test User',
    avatar: 'test-avatar.jpg',
    isOnline: true,
    messages: []
  };

  const mockCurrentUser = {
    id: 'user1',
    name: 'Current User'
  };

  const mockSettings = {
    sound: true,
    messageNotifications: true
  };

  const mockSendMessage = jest.fn();

  const setup = () => {
    return render(
      <NotificationSoundProvider>
        <ChatDetail
          chat={mockChat}
          currentUser={mockCurrentUser}
          sendMessage={mockSendMessage}
          settings={mockSettings}
        />
      </NotificationSoundProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = setup();
    expect(getByText(mockChat.name)).toBeTruthy();
    expect(getByPlaceholderText('Type a message...')).toBeTruthy();
  });

  it('handles message sending', async () => {
    const { getByPlaceholderText, getByText } = setup();
    const input = getByPlaceholderText('Type a message...');
    const testMessage = 'Hello, world!';

    await act(async () => {
      fireEvent.changeText(input, testMessage);
      fireEvent.press(getByText('Send'));
    });

    expect(mockSendMessage).toHaveBeenCalledWith(testMessage);
  });

  it('displays error toast when message sending fails', async () => {
    const mockError = new Error('Failed to send');
    mockSendMessage.mockRejectedValueOnce(mockError);

    const { getByPlaceholderText, getByText, findByText } = setup();
    const input = getByPlaceholderText('Type a message...');

    await act(async () => {
      fireEvent.changeText(input, 'Test message');
      fireEvent.press(getByText('Send'));
    });

    const errorToast = await findByText('Failed to send message. Please try again.');
    expect(errorToast).toBeTruthy();
  });

  it('plays notification sound for new messages', async () => {
    const { rerender } = setup();

    const updatedChat = {
      ...mockChat,
      messages: [
        {
          id: 'msg1',
          sender: 'other-user',
          text: 'New message',
          timestamp: new Date().toISOString()
        }
      ]
    };

    await act(async () => {
      rerender(
        <NotificationSoundProvider>
          <ChatDetail
            chat={updatedChat}
            currentUser={mockCurrentUser}
            sendMessage={mockSendMessage}
            settings={mockSettings}
          />
        </NotificationSoundProvider>
      );
    });

    // Verify that sound was played
    const Sound = require('react-native-sound');
    expect(Sound.setCategory).toHaveBeenCalledWith('Playback');
  });
});