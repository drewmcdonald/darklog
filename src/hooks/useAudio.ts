import { useEffect, useCallback, useRef } from 'react';

const audioCache: Record<string, HTMLAudioElement> = {};

function preload(src: string): HTMLAudioElement {
  if (!audioCache[src]) {
    audioCache[src] = new Audio(src);
    audioCache[src].load();
  }
  return audioCache[src];
}

export function useAudio() {
  const hasInteracted = useRef(false);

  useEffect(() => {
    const handleInteraction = () => {
      hasInteracted.current = true;
      preload('/sounds/step-end.mp3');
      preload('/sounds/final-end.mp3');
      preload('/sounds/agitate.mp3');
    };

    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const play = useCallback((src: string) => {
    if (!hasInteracted.current) return;

    const audio = preload(src);
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Ignore autoplay restrictions
    });
  }, []);

  const playStepEnd = useCallback(() => play('/sounds/step-end.mp3'), [play]);
  const playFinalEnd = useCallback(() => play('/sounds/final-end.mp3'), [play]);
  const playAgitate = useCallback(() => play('/sounds/agitate.mp3'), [play]);

  return {
    playStepEnd,
    playFinalEnd,
    playAgitate,
  };
}
