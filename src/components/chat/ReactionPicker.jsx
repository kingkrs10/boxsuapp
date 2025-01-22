import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThumbsUp, Heart, Star, SmilePlus, X } from 'lucide-react-native';

const ReactionPicker = ({ onSelectReaction, onClose, existingReactions = [] }) => {
  const reactions = [
    { emoji: ThumbsUp, label: 'like', color: '#3b82f6' },
    { emoji: Heart, label: 'love', color: '#ef4444' },
    { emoji: Star, label: 'star', color: '#eab308' },
    { emoji: SmilePlus, label: 'smile', color: '#22c55e' }
  ];

  const handleReactionPress = (reaction) => {
    onSelectReaction(reaction.label);
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.reactionsRow}>
        {reactions.map((reaction) => {
          const ReactionIcon = reaction.emoji;
          const isSelected = existingReactions.includes(reaction.label);
          
          return (
            <TouchableOpacity
              key={reaction.label}
              onPress={() => handleReactionPress(reaction)}
              style={[
                styles.reactionButton,
                isSelected && styles.reactionButtonSelected
              ]}
            >
              <ReactionIcon
                size={20}
                color={reaction.color}
                fill={isSelected ? reaction.color : 'none'}
              />
            </TouchableOpacity>
          );
        })}
        
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '100%',
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  reactionButton: {
    padding: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  reactionButtonSelected: {
    backgroundColor: '#f3f4f6',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 4,
  },
});

export default ReactionPicker;