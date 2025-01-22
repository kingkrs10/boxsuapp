const DB_NAME = 'BoxsuChat';
const DB_VERSION = 1;
const STORE_NAME = 'messages';
const MAX_MESSAGE_SIZE = 5 * 1024 * 1024; // 5MB limit per message
const MAX_STORAGE_QUOTA = 50 * 1024 * 1024; // 50MB total storage limit

class DatabaseService {
  db = null;

  async initDB() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  async getTotalStorageUsed() {
    const messages = await this.getAllMessages();
    return messages.reduce((total, msg) => {
      if (msg.content instanceof Blob) {
        return total + msg.content.size;
      }
      return total + (new TextEncoder().encode(msg.content)).length;
    }, 0);
  }

  async checkStorageQuota(newMessageSize) {
    const currentUsage = await this.getTotalStorageUsed();
    return (currentUsage + newMessageSize) <= MAX_STORAGE_QUOTA;
  }

  async getAllMessages() {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async addMessage(message) {
    if (message.content instanceof Blob && message.content.size > MAX_MESSAGE_SIZE) {
      throw new Error(`Message exceeds size limit of ${MAX_MESSAGE_SIZE / (1024 * 1024)}MB`);
    }

    const hasSpace = await this.checkStorageQuota(
      message.content instanceof Blob ? message.content.size : new TextEncoder().encode(message.content).length
    );
    
    if (!hasSpace) {
      throw new Error('Storage quota exceeded. Please delete some messages.');
    }

    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(message);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async deleteMessage(id) {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  async getMessagesByType(type) {
    await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('type');
      const request = index.getAll(type);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }
}

export const dbService = new DatabaseService();