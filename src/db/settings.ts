import { getDB } from './index';
import type { AppSettings, StickyValues } from '../types';
import { DEFAULT_APP_SETTINGS, DEFAULT_STICKY_VALUES } from '../utils/defaults';

export async function getAppSettings(): Promise<AppSettings> {
  const db = await getDB();
  const settings = await db.get('settings', 'app');
  return settings ?? { ...DEFAULT_APP_SETTINGS };
}

export async function updateAppSettings(
  updates: Partial<Omit<AppSettings, 'id'>>
): Promise<AppSettings> {
  const db = await getDB();
  const current = await getAppSettings();

  const updated: AppSettings = {
    ...current,
    ...updates,
    id: 'app',
  };

  await db.put('settings', updated);
  return updated;
}

export async function getStickyValues(): Promise<StickyValues> {
  const db = await getDB();
  const sticky = await db.get('sticky', 'default');
  return sticky ?? ({ ...DEFAULT_STICKY_VALUES, id: 'default' } as StickyValues & { id: string });
}

export async function updateStickyValues(updates: Partial<StickyValues>): Promise<StickyValues> {
  const db = await getDB();
  const current = await getStickyValues();

  const updated = {
    ...current,
    ...updates,
    id: 'default',
  };

  await db.put('sticky', updated as StickyValues & { id: string });
  return updated;
}
