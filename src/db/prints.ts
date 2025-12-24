import { getDB } from './index';
import type { PrintRecord, PaperSettings, ExposureSettings, ProcessingRecord } from '../types';
import { generateId, timestamp } from '../utils/id';
import {
  DEFAULT_PAPER_SETTINGS,
  DEFAULT_EXPOSURE_SETTINGS,
  DEFAULT_PROCESSING,
} from '../utils/defaults';

export interface CreatePrintOptions {
  sessionId: string;
  rollId?: string;
  frameNumber?: string;
  paper?: PaperSettings;
  exposure?: ExposureSettings;
  processing?: ProcessingRecord;
}

export async function createPrint(options: CreatePrintOptions): Promise<PrintRecord> {
  const db = await getDB();
  const now = timestamp();

  const print: PrintRecord = {
    id: generateId(),
    createdAt: now,
    updatedAt: now,
    sessionId: options.sessionId,
    rollId: options.rollId ?? '',
    frameNumber: options.frameNumber ?? '',
    paper: options.paper ?? { ...DEFAULT_PAPER_SETTINGS },
    exposure: options.exposure ?? { ...DEFAULT_EXPOSURE_SETTINGS },
    processing: options.processing ?? { ...DEFAULT_PROCESSING },
    testStrips: [],
    notes: '',
    rating: null,
  };

  await db.put('prints', print);
  return print;
}

export async function getPrint(id: string): Promise<PrintRecord | undefined> {
  const db = await getDB();
  return db.get('prints', id);
}

export async function updatePrint(
  id: string,
  updates: Partial<Omit<PrintRecord, 'id' | 'createdAt' | 'sessionId'>>
): Promise<PrintRecord | undefined> {
  const db = await getDB();
  const print = await db.get('prints', id);

  if (!print) return undefined;

  const updated: PrintRecord = {
    ...print,
    ...updates,
    updatedAt: timestamp(),
  };

  await db.put('prints', updated);
  return updated;
}

export async function deletePrint(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('prints', id);
}

export async function getPrintsBySession(sessionId: string): Promise<PrintRecord[]> {
  const db = await getDB();
  const prints = await db.getAllFromIndex('prints', 'by-session', sessionId);
  return prints.reverse();
}

export async function getPrintsByRoll(rollId: string): Promise<PrintRecord[]> {
  const db = await getDB();
  return db.getAllFromIndex('prints', 'by-roll', rollId);
}

export async function getAllPrints(): Promise<PrintRecord[]> {
  const db = await getDB();
  const prints = await db.getAllFromIndex('prints', 'by-created');
  return prints.reverse();
}

export async function getSessionPrintCount(sessionId: string): Promise<number> {
  const prints = await getPrintsBySession(sessionId);
  return prints.length;
}
