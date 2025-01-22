import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const TypingIndicator = ({ isTyping }) => {
  if (!isTyping) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Someone is typing...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 5,
    backgroundColor: '#f5f5f5',
  },
  text: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export { MessageInput, MessageList, TypingIndicator };