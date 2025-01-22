import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useToast } from '../components/common/Toast/useToast';

const COLLECTION_MESSAGES = 'messages';
const COLLECTION_CHATS = 'chats';
const COLLECTION_TYPING = 'typing';

class ChatService {
  constructor() {
    this.db = firestore();
    this.storage = storage();
    this.subscriptions = new Map();
  }

  // Message Operations
  subscribeToMessages = (chatId, limit = 20, callback, showToast) => {
    const query = this.db
      .collection(COLLECTION_MESSAGES)
      .where('chatId', '==', chatId)
      .orderBy('timestamp', 'desc')
      .limit(limit);

    const unsubscribe = query.onSnapshot(
      (snapshot) => {
        const messages = [];
        snapshot.forEach((doc) => {
          messages.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        callback(messages);
      },
      (error) => {
        console.error('Error in messages subscription:', error);
        showToast('Failed to load messages. Please try again.', 'error');
      }
    );

    this.subscriptions.set(`messages_${chatId}`, unsubscribe);
    return () => {
      unsubscribe();
      this.subscriptions.delete(`messages_${chatId}`);
    };
  };

  loadMoreMessages = async (chatId, lastMessageId, limit = 20, showToast) => {
    try {
      const lastMessageDoc = await this.db
        .collection(COLLECTION_MESSAGES)
        .doc(lastMessageId)
        .get();

      const query = this.db
        .collection(COLLECTION_MESSAGES)
        .where('chatId', '==', chatId)
        .orderBy('timestamp', 'desc')
        .startAfter(lastMessageDoc)
        .limit(limit);

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error loading more messages:', error);
      showToast('Failed to load older messages', 'error');
      throw error;
    }
  };

  sendMessage = async (chatId, userId, content, type = 'text', showToast) => {
    try {
      const messageData = {
        chatId,
        senderId: userId,
        content,
        type,
        timestamp: firestore.FieldValue.serverTimestamp(),
        reactions: {},
        edited: false
      };

      const docRef = await this.db
        .collection(COLLECTION_MESSAGES)
        .add(messageData);

      await this.db
        .collection(COLLECTION_CHATS)
        .doc(chatId)
        .update({
          lastMessage: {
            content: type === 'text' ? content : `Sent a ${type}`,
            timestamp: messageData.timestamp
          }
        });

      showToast('Message sent', 'success');
      return {
        id: docRef.id,
        ...messageData,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('Failed to send message', 'error');
      throw error;
    }
  };

  deleteMessage = async (messageId, showToast) => {
    try {
      const messageRef = this.db
        .collection(COLLECTION_MESSAGES)
        .doc(messageId);
      
      const message = await messageRef.get();
      
      if (message.data()?.attachments) {
        await Promise.all(
          message.data().attachments.map(async (attachment) => {
            await this.storage.ref(attachment.path).delete();
          })
        );
      }
      
      await messageRef.delete();
      showToast('Message deleted', 'success');
    } catch (error) {
      console.error('Error deleting message:', error);
      showToast('Failed to delete message', 'error');
      throw error;
    }
  };

  editMessage = async (messageId, newContent, showToast) => {
    try {
      await this.db
        .collection(COLLECTION_MESSAGES)
        .doc(messageId)
        .update({
          content: newContent,
          edited: true,
          editedAt: firestore.FieldValue.serverTimestamp()
        });
      showToast('Message updated', 'success');
    } catch (error) {
      console.error('Error editing message:', error);
      showToast('Failed to edit message', 'error');
      throw error;
    }
  };

  addReaction = async (messageId, userId, reaction, showToast) => {
    try {
      const messageRef = this.db
        .collection(COLLECTION_MESSAGES)
        .doc(messageId);

      await messageRef.update({
        [`reactions.${userId}`]: reaction
      });
      showToast('Reaction added', 'success');
    } catch (error) {
      console.error('Error adding reaction:', error);
      showToast('Failed to add reaction', 'error');
      throw error;
    }
  };

  removeReaction = async (messageId, userId, showToast) => {
    try {
      const messageRef = this.db
        .collection(COLLECTION_MESSAGES)
        .doc(messageId);

      await messageRef.update({
        [`reactions.${userId}`]: firestore.FieldValue.delete()
      });
      showToast('Reaction removed', 'success');
    } catch (error) {
      console.error('Error removing reaction:', error);
      showToast('Failed to remove reaction', 'error');
      throw error;
    }
  };

  subscribeToTypingIndicators = (chatId, callback, showToast) => {
    const query = this.db
      .collection(COLLECTION_TYPING)
      .where('chatId', '==', chatId);

    const unsubscribe = query.onSnapshot(
      (snapshot) => {
        const typingUsers = {};
        snapshot.forEach((doc) => {
          const { userId, isTyping } = doc.data();
          if (isTyping) {
            typingUsers[userId] = true;
          }
        });
        callback(typingUsers);
      },
      (error) => {
        console.error('Error in typing subscription:', error);
        showToast('Failed to sync typing indicators', 'error');
      }
    );

    this.subscriptions.set(`typing_${chatId}`, unsubscribe);
    return () => {
      unsubscribe();
      this.subscriptions.delete(`typing_${chatId}`);
    };
  };

  cleanup = () => {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions.clear();
  };
}

export default new ChatService();
