import { getDB } from './index';
import type { Session, SessionDefaults } from '../types';
import { generateId, timestamp, dateString } from '../utils/id';
import { DEFAULT_SESSION_DEFAULTS } from '../utils/defaults';

export async function createSession(
  defaults: SessionDefaults = DEFAULT_SESSION_DEFAULTS
): Promise<Session> {
  const db = await getDB();
  const now = timestamp();

  const session: Session = {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    date: dateString(),
    defaults,
    notes: '',
  };

  await db.put('sessions', session);
  return session;
}

export async function getSession(id: string): Promise<Session | undefined> {
  const db = await getDB();
  return db.get('sessions', id);
}

export async function updateSession(
  id: string,
  updates: Partial<Omit<Session, 'id' | 'createdAt'>>
): Promise<Session | undefined> {
  const db = await getDB();
  const session = await db.get('sessions', id);

  if (!session) return undefined;

  const updated: Session = {
    ...session,
    ...updates,
    updatedAt: timestamp(),
  };

  await db.put('sessions', updated);
  return updated;
}

export async function deleteSession(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('sessions', id);
}

export async function getAllSessions(): Promise<Session[]> {
  const db = await getDB();
  const sessions = await db.getAllFromIndex('sessions', 'by-created');
  return sessions.reverse();
}

export async function getSessionsByDate(date: string): Promise<Session[]> {
  const db = await getDB();
  return db.getAllFromIndex('sessions', 'by-date', date);
}

export async function getMostRecentSession(): Promise<Session | undefined> {
  const sessions = await getAllSessions();
  return sessions[0];
}

export async function getTodaysSession(): Promise<Session | undefined> {
  const today = dateString();
  const sessions = await getSessionsByDate(today);
  return sessions[0];
}
