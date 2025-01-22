import React, { useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl
} from 'react-native';
import MessageItem from './MessageItem';

const MessageList = ({
  messages,
  currentUserId,
  onReaction,
  onDeleteMessage,
  onEditMessage,
  onLoadMore,
  isLoadingMore,
  hasMoreMessages
}) => {
  const flatListRef = useRef(null);
  const onEndReachedCalledDuringMomentum = useRef(false);

  const renderMessage = useCallback(({ item: message, index }) => (
    <MessageItem
      message={message}
      currentUserId={currentUserId}
      onReaction={onReaction}
      onDelete={onDeleteMessage}
      onEdit={onEditMessage}
      isConsecutive={messages[index + 1]?.senderId === message.senderId}
      hasNextFromSameSender={messages[index - 1]?.senderId === message.senderId}
    />
  ), [currentUserId, onReaction, onDeleteMessage, onEditMessage, messages]);

  const handleEndReached = useCallback(() => {
    if (!onEndReachedCalledDuringMomentum.current && hasMoreMessages && !isLoadingMore) {
      onEndReachedCalledDuringMomentum.current = true;
      onLoadMore();
    }
  }, [hasMoreMessages, isLoadingMore, onLoadMore]);

  const renderFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  }, [isLoadingMore]);

  const keyExtractor = useCallback((item) => item.id, []);

  const getItemLayout = useCallback((data, index) => ({
    length: 80, // Approximate height of each message
    offset: 80 * index,
    index,
  }), []);

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderMessage}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      inverted
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      onMomentumScrollBegin={() => {
        onEndReachedCalledDuringMomentum.current = false;
      }}
      ListFooterComponent={renderFooter}
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
      initialNumToRender={15}
      maxToRenderPerBatch={10}
      windowSize={21}
      removeClippedSubviews={true}
      contentContainerStyle={styles.contentContainer}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  loadingFooter: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default React.memo(MessageList);