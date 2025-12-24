import { useCallback } from 'react';

export function useVibration() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const vibrateStep = useCallback(() => {
    if (isSupported) {
      navigator.vibrate([200, 100, 200]);
    }
  }, [isSupported]);

  const vibrateAgitate = useCallback(() => {
    if (isSupported) {
      navigator.vibrate(100);
    }
  }, [isSupported]);

  const vibrateFinal = useCallback(() => {
    if (isSupported) {
      navigator.vibrate([300, 100, 300, 100, 300]);
    }
  }, [isSupported]);

  return { isSupported, vibrateStep, vibrateAgitate, vibrateFinal };
}
