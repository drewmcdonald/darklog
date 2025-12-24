import { useState, useRef, useCallback, useEffect } from 'react';
import type { ProcessingStep } from '../types';
import { useAudio } from './useAudio';
import { useVibration } from './useVibration';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'transferring' | 'complete';

export interface TimerState {
  status: TimerStatus;
  currentStepIndex: number;
  remainingTime: number;
  nextAgitationIn: number | null;
  totalElapsed: number;
}

interface UseTimerOptions {
  steps: ProcessingStep[];
  transferDelay: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onComplete: () => void;
}

export function useTimer({
  steps,
  transferDelay,
  soundEnabled,
  vibrationEnabled,
  onComplete,
}: UseTimerOptions) {
  const [state, setState] = useState<TimerState>(() => ({
    status: 'idle',
    currentStepIndex: 0,
    remainingTime: steps[0]?.duration ?? 0,
    nextAgitationIn: steps[0]?.agitationInterval ?? null,
    totalElapsed: 0,
  }));

  const intervalRef = useRef<number | null>(null);
  const { playStepEnd, playFinalEnd, playAgitate } = useAudio();
  const { vibrateStep, vibrateAgitate, vibrateFinal } = useVibration();

  const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);

  const tick = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'running' && prev.status !== 'transferring') {
        return prev;
      }

      const newRemaining = prev.remainingTime - 1;
      let newAgitation = prev.nextAgitationIn;

      if (prev.status === 'running') {
        // Handle agitation countdown
        if (newAgitation !== null) {
          newAgitation = newAgitation - 1;

          if (newAgitation <= 0) {
            if (soundEnabled) playAgitate();
            if (vibrationEnabled) vibrateAgitate();
            const interval = steps[prev.currentStepIndex].agitationInterval;
            newAgitation = interval ?? null;
          }
        }

        // Step complete
        if (newRemaining <= 0) {
          const isLastStep = prev.currentStepIndex >= steps.length - 1;

          if (isLastStep) {
            if (soundEnabled) playFinalEnd();
            if (vibrationEnabled) vibrateFinal();
            setTimeout(onComplete, 0);
            return {
              ...prev,
              status: 'complete' as TimerStatus,
              remainingTime: 0,
              totalElapsed: prev.totalElapsed + 1,
            };
          }

          // Start transfer delay
          if (soundEnabled) playStepEnd();
          if (vibrationEnabled) vibrateStep();
          return {
            ...prev,
            status: 'transferring' as TimerStatus,
            remainingTime: transferDelay,
            nextAgitationIn: null,
            totalElapsed: prev.totalElapsed + 1,
          };
        }
      }

      // Handle transfer completion
      if (prev.status === 'transferring' && newRemaining <= 0) {
        const nextIndex = prev.currentStepIndex + 1;
        const nextStep = steps[nextIndex];
        return {
          status: 'running' as TimerStatus,
          currentStepIndex: nextIndex,
          remainingTime: nextStep.duration,
          nextAgitationIn: nextStep.agitationInterval ?? null,
          totalElapsed: prev.totalElapsed,
        };
      }

      return {
        ...prev,
        remainingTime: newRemaining,
        nextAgitationIn: newAgitation,
        totalElapsed: prev.totalElapsed + 1,
      };
    });
  }, [
    steps,
    transferDelay,
    soundEnabled,
    vibrationEnabled,
    onComplete,
    playStepEnd,
    playFinalEnd,
    playAgitate,
    vibrateStep,
    vibrateAgitate,
    vibrateFinal,
  ]);

  // Interval management
  useEffect(() => {
    // Always clear existing interval first to prevent multiple overlapping intervals
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Then create new interval if needed
    if (state.status === 'running' || state.status === 'transferring') {
      intervalRef.current = window.setInterval(tick, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state.status, tick]);

  const start = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'running' }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'paused' }));
  }, []);

  const resume = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'running' }));
  }, []);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      currentStepIndex: 0,
      remainingTime: steps[0]?.duration ?? 0,
      nextAgitationIn: steps[0]?.agitationInterval ?? null,
      totalElapsed: 0,
    });
  }, [steps]);

  return {
    state,
    currentStep: steps[state.currentStepIndex],
    nextStep: steps[state.currentStepIndex + 1] ?? null,
    totalDuration,
    start,
    pause,
    resume,
    reset,
  };
}
