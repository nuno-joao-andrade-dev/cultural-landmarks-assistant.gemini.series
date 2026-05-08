import { openDB } from 'idb';

const DB_NAME = 'gcp_workshop_db';
const STORE_NAME = 'messages';

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

export const saveMessage = async (message) => {
  const db = await initDB();
  return db.add(STORE_NAME, { ...message, timestamp: Date.now() });
};

export const getAllMessages = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const clearHistory = async () => {
  const db = await initDB();
  return db.clear(STORE_NAME);
};
