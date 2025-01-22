import React, { useState, memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Pressable } from 'react-native';
import { Smile, MoreVertical, Edit2, Trash } from 'lucide-react-native';
import ReactionPicker from './ReactionPicker';

const MessageItem = ({
  message,
  currentUserId,
  onReaction,
  onDelete,
  onEdit,
  isConsecutive = false,
  hasNextFromSameSender = false
}) => {
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const isCurrentUser = message.senderId === currentUserId;

  const toggleReactionPicker = useCallback(() => {
    setShowReactionPicker(prev => !prev);
    setShowOptions(false);
  }, []);

  const toggleOptions = useCallback(() => {
    setShowOptions(prev => !prev);
    setShowReactionPicker(false);
  }, []);

  const handleReactionSelect = useCallback((reaction) => {
    onReaction(message.id, reaction);
    setShowReactionPicker(false);
  }, [message.id, onReaction]);

  const handleDelete = useCallback(() => {
    onDelete(message.id);
    setShowOptions(false);
  }, [message.id, onDelete]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setShowOptions(false);
  }, []);

  const handleEditComplete = useCallback((newContent) => {
    onEdit(message.id, newContent);
    setIsEditing(false);
  }, [message.id, onEdit]);

  const formatTime = useCallback((timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  // Determine message bubble style based on grouping
  const getBubbleStyle = () => {
    const baseStyle = [styles.messageBubble, isCurrentUser ? styles.currentUserBubble : null];
    
    if (!isConsecutive && !hasNextFromSameSender) {
      // Single message
      return [...baseStyle, isCurrentUser ? styles.currentUserSingleBubble : styles.singleBubble];
    } else if (!isConsecutive) {
      // First message in group
      return [...baseStyle, isCurrentUser ? styles.currentUserFirstBubble : styles.firstBubble];
    } else if (!hasNextFromSameSender) {
      // Last message in group
      return [...baseStyle, isCurrentUser ? styles.currentUserLastBubble : styles.lastBubble];
    }
    // Middle message in group
    return [...baseStyle, isCurrentUser ? styles.currentUserMiddleBubble : styles.middleBubble];
  };

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.currentUserContainer : null
    ]}>
      {/* Avatar */}
      {!isConsecutive && (
        <View style={[
          styles.avatarContainer,
          isCurrentUser ? styles.currentUserAvatar : null
        ]}>
          {message.senderAvatar ? (
            <Image
              source={{ uri: message.senderAvatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]} />
          )}
        </View>
      )}

      <View style={[
        styles.messageContent,
        isCurrentUser ? styles.currentUserContent : null,
        isConsecutive ? styles.consecutiveMessage : null
      ]}>
        {/* Sender name */}
        {!isConsecutive && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}

        {/* Message bubble */}
        <Pressable onLongPress={toggleOptions}>
          <View style={getBubbleStyle()}>
            {isEditing ? (
              <MessageEditInput
                initialContent={message.content}
                onComplete={handleEditComplete}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <Text style={[
                styles.messageText,
                isCurrentUser ? styles.currentUserText : null
              ]}>
                {message.content}
              </Text>
            )}

            {/* Message options */}
            {!isEditing && isCurrentUser && (
              <TouchableOpacity
                onPress={toggleOptions}
                style={styles.optionsButton}
              >
                <MoreVertical size={16} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </Pressable>

        {/* Message options menu */}
        {showOptions && isCurrentUser && (
          <View style={styles.optionsMenu}>
            <TouchableOpacity onPress={handleEdit} style={styles.optionItem}>
              <Edit2 size={16} color="#4b5563" />
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.optionItem}>
              <Trash size={16} color="#ef4444" />
              <Text style={[styles.optionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <View style={styles.reactionsContainer}>
            {message.reactions.map((reaction, index) => (
              <TouchableOpacity 
                key={`${reaction}-${index}`}
                onPress={() => handleReactionSelect(reaction)}
                style={styles.reactionBadge}
              >
                <Text style={styles.reactionText}>{reaction}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Timestamp */}
        <Text style={styles.timestamp}>
          {formatTime(message.createdAt || message.timestamp)}
        </Text>
      </View>

      {/* Reaction button */}
      <TouchableOpacity
        onPress={toggleReactionPicker}
        style={[
          styles.reactionButton,
          isCurrentUser ? styles.currentUserReactionButton : null
        ]}
      >
        <Smile size={16} color="#6b7280" />
      </TouchableOpacity>

      {/* Reaction picker */}
      {showReactionPicker && (
        <ReactionPicker
          onSelectReaction={handleReactionSelect}
          onClose={() => setShowReactionPicker(false)}
          existingReactions={message.reactions || []}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // ... existing styles ...
  
  // New and updated styles
  currentUserSingleBubble: {
    borderRadius: 16,
  },
  singleBubble: {
    borderRadius: 16,
  },
  currentUserFirstBubble: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
    marginBottom: 1,
  },
  firstBubble: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 16,
    marginBottom: 1,
  },
  currentUserMiddleBubble: {
    borderRadius: 4,
    marginVertical: 1,
  },
  middleBubble: {
    borderRadius: 4,
    marginVertical: 1,
  },
  currentUserLastBubble: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: 1,
  },
  lastBubble: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: 1,
  },
  optionsButton: {
    position: 'absolute',
    right: -24,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
  optionsMenu: {
    position: 'absolute',
    right: 0,
    top: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    minWidth: 120,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  deleteText: {
    color: '#ef4444',
  },
  currentUserReactionButton: {
    right: 'auto',
    left: -28,
  },
});

export default memo(MessageItem);