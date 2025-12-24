import { useState, useEffect, useCallback } from 'react';
import type { Session, PrintRecord, AppSettings, StickyValues } from '../types';
import {
  getAllSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  getTodaysSession,
} from '../db/sessions';
import {
  getPrintsBySession,
  getPrint,
  createPrint,
  updatePrint,
  deletePrint,
  type CreatePrintOptions,
} from '../db/prints';
import {
  getAppSettings,
  updateAppSettings,
  getStickyValues,
  updateStickyValues,
} from '../db/settings';

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getAllSessions();
    setSessions(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { sessions, loading, refresh };
}

export function useSession(id: string | undefined) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!id) {
      setSession(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const data = await getSession(id);
    setSession(data ?? null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { session, loading, refresh };
}

export function useTodaysSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getTodaysSession();
      setSession(data ?? null);
      setLoading(false);
    })();
  }, []);

  return { session, loading };
}

export function useSessionPrints(sessionId: string | undefined) {
  const [prints, setPrints] = useState<PrintRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!sessionId) {
      setPrints([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const data = await getPrintsBySession(sessionId);
    setPrints(data);
    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { prints, loading, refresh };
}

export function usePrint(id: string | undefined) {
  const [print, setPrint] = useState<PrintRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!id) {
      setPrint(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const data = await getPrint(id);
    setPrint(data ?? null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { print, loading, refresh };
}

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getAppSettings();
      setSettings(data);
      setLoading(false);
    })();
  }, []);

  const update = useCallback(async (updates: Partial<Omit<AppSettings, 'id'>>) => {
    const updated = await updateAppSettings(updates);
    setSettings(updated);
    return updated;
  }, []);

  return { settings, loading, update };
}

export function useStickyValues() {
  const [sticky, setSticky] = useState<StickyValues | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getStickyValues();
      setSticky(data);
      setLoading(false);
    })();
  }, []);

  const update = useCallback(async (updates: Partial<StickyValues>) => {
    const updated = await updateStickyValues(updates);
    setSticky(updated);
    return updated;
  }, []);

  return { sticky, loading, update };
}

// Re-export DB functions for direct use
export {
  createSession,
  updateSession,
  deleteSession,
  createPrint,
  updatePrint,
  deletePrint,
  type CreatePrintOptions,
};
