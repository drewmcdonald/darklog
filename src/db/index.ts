import type { DBSchema, IDBPDatabase } from 'idb';
import { openDB } from 'idb';
import type { Session, PrintRecord, AppSettings, StickyValues } from '../types';

interface DarkLogDB extends DBSchema {
  sessions: {
    key: string;
    value: Session;
    indexes: {
      'by-date': string;
      'by-created': string;
    };
  };
  prints: {
    key: string;
    value: PrintRecord;
    indexes: {
      'by-session': string;
      'by-roll': string;
      'by-created': string;
    };
  };
  settings: {
    key: string;
    value: AppSettings;
  };
  sticky: {
    key: string;
    value: StickyValues;
  };
}

let dbInstance: IDBPDatabase<DarkLogDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<DarkLogDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<DarkLogDB>('darklog', 1, {
    upgrade(db) {
      // Sessions store
      const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
      sessionStore.createIndex('by-date', 'date');
      sessionStore.createIndex('by-created', 'createdAt');

      // Prints store
      const printStore = db.createObjectStore('prints', { keyPath: 'id' });
      printStore.createIndex('by-session', 'sessionId');
      printStore.createIndex('by-roll', 'rollId');
      printStore.createIndex('by-created', 'createdAt');

      // Settings store
      db.createObjectStore('settings', { keyPath: 'id' });

      // Sticky values store
      db.createObjectStore('sticky', { keyPath: 'id' });
    },
  });

  return dbInstance;
}

export * from './sessions';
export * from './prints';
export * from './settings';
