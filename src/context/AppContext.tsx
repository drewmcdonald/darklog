import type { ReactNode } from 'react';
import { createContext, useContext, useReducer, useCallback } from 'react';
import type { Screen, Session, PrintRecord, AppSettings } from '../types';

interface AppState {
  screen: Screen;
  currentSession: Session | null;
  currentPrint: PrintRecord | null;
  settings: AppSettings | null;
}

type AppAction =
  | { type: 'NAVIGATE'; screen: Screen }
  | { type: 'SET_SESSION'; session: Session | null }
  | { type: 'SET_PRINT'; print: PrintRecord | null }
  | { type: 'SET_SETTINGS'; settings: AppSettings };

const initialState: AppState = {
  screen: { name: 'home' },
  currentSession: null,
  currentPrint: null,
  settings: null,
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.screen };
    case 'SET_SESSION':
      return { ...state, currentSession: action.session };
    case 'SET_PRINT':
      return { ...state, currentPrint: action.print };
    case 'SET_SETTINGS':
      return { ...state, settings: action.settings };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  navigate: (screen: Screen) => void;
  setSession: (session: Session | null) => void;
  setPrint: (print: PrintRecord | null) => void;
  setSettings: (settings: AppSettings) => void;
  goHome: () => void;
  goToSessionSetup: (sessionId?: string) => void;
  goToPrintEditor: (sessionId: string, printId?: string) => void;
  goToTimer: (sessionId: string, printId: string) => void;
  goToNotes: (sessionId: string, printId: string) => void;
  goToSettings: () => void;
  goToHistory: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useCallback((screen: Screen) => {
    dispatch({ type: 'NAVIGATE', screen });
  }, []);

  const setSession = useCallback((session: Session | null) => {
    dispatch({ type: 'SET_SESSION', session });
  }, []);

  const setPrint = useCallback((print: PrintRecord | null) => {
    dispatch({ type: 'SET_PRINT', print });
  }, []);

  const setSettings = useCallback((settings: AppSettings) => {
    dispatch({ type: 'SET_SETTINGS', settings });
  }, []);

  const goHome = useCallback(() => {
    navigate({ name: 'home' });
  }, [navigate]);

  const goToSessionSetup = useCallback(
    (sessionId?: string) => {
      navigate({ name: 'sessionSetup', sessionId });
    },
    [navigate]
  );

  const goToPrintEditor = useCallback(
    (sessionId: string, printId?: string) => {
      navigate({ name: 'printEditor', sessionId, printId });
    },
    [navigate]
  );

  const goToTimer = useCallback(
    (sessionId: string, printId: string) => {
      navigate({ name: 'timer', sessionId, printId });
    },
    [navigate]
  );

  const goToNotes = useCallback(
    (sessionId: string, printId: string) => {
      navigate({ name: 'notes', sessionId, printId });
    },
    [navigate]
  );

  const goToSettings = useCallback(() => {
    navigate({ name: 'settings' });
  }, [navigate]);

  const goToHistory = useCallback(() => {
    navigate({ name: 'history' });
  }, [navigate]);

  const value: AppContextValue = {
    state,
    navigate,
    setSession,
    setPrint,
    setSettings,
    goHome,
    goToSessionSetup,
    goToPrintEditor,
    goToTimer,
    goToNotes,
    goToSettings,
    goToHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
