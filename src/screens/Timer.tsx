import { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useSession, usePrint, useAppSettings } from '../hooks';
import { useTimer } from '../hooks/useTimer';
import { Button, TimerDisplay, ProgressBar, SessionContext } from '../components';

export function Timer() {
  const { state, goToNotes } = useApp();
  const screen = state.screen;
  const sessionId = screen.name === 'timer' ? screen.sessionId : '';
  const printId = screen.name === 'timer' ? screen.printId : '';

  const { session } = useSession(sessionId);
  const { print } = usePrint(printId);
  const { settings } = useAppSettings();

  const steps = print?.processing?.steps ?? session?.defaults.processing.steps ?? [];
  const transferDelay = settings?.transferDelay ?? 2;

  const {
    state: timerState,
    currentStep,
    nextStep,
    totalDuration,
    start,
    pause,
    resume,
  } = useTimer({
    steps,
    transferDelay,
    soundEnabled: settings?.soundEnabled ?? true,
    vibrationEnabled: settings?.vibrationEnabled ?? true,
    onComplete: () => goToNotes(sessionId, printId),
  });

  // Auto-start timer on first load
  const hasAutoStarted = useRef(false);
  useEffect(() => {
    if (timerState.status === 'idle' && !hasAutoStarted.current && steps.length > 0) {
      hasAutoStarted.current = true;
      start();
    }
  }, [timerState.status, start, steps.length]);

  const progress = totalDuration > 0 ? timerState.totalElapsed / totalDuration : 0;

  if (!session || !print) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center p-6 max-w-125 mx-auto w-full">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-125 mx-auto w-full">
      <SessionContext sessionId={sessionId} />
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        {timerState.status === 'idle' && (
          <>
            <TimerDisplay
              seconds={timerState.remainingTime}
              label={currentStep?.chemical ?? 'Ready'}
            />
            <div className="w-full max-w-[300px] mt-8">
              <Button size="large" onClick={start}>
                START
              </Button>
            </div>
            <div className="text-text-muted mt-4">Tap to begin {currentStep?.chemical}</div>
          </>
        )}

        {timerState.status === 'running' && (
          <>
            <TimerDisplay
              seconds={timerState.remainingTime}
              label={currentStep?.chemical ?? ''}
              sublabel={
                timerState.nextAgitationIn !== null
                  ? `Agitate in ${timerState.nextAgitationIn}s`
                  : undefined
              }
            />
            <div className="w-full max-w-[300px] my-8">
              <ProgressBar progress={progress} />
            </div>
            <div className="w-full max-w-[300px]">
              <Button size="large" variant="secondary" onClick={pause}>
                PAUSE
              </Button>
            </div>
            {nextStep && <div className="text-text-muted mt-4">Next: {nextStep.chemical}</div>}
          </>
        )}

        {timerState.status === 'paused' && (
          <>
            <TimerDisplay
              seconds={timerState.remainingTime}
              label={currentStep?.chemical ?? ''}
              sublabel="PAUSED"
            />
            <div className="w-full max-w-[300px] mt-8">
              <Button size="large" onClick={resume}>
                RESUME
              </Button>
            </div>
          </>
        )}

        {timerState.status === 'transferring' && (
          <>
            <div className="text-center">
              <div className="text-xl text-text-secondary mb-4">TRANSFER TO</div>
              <div className="text-2xl font-bold">{nextStep?.chemical ?? 'Next Step'}</div>
              <div className="text-timer font-bold mt-4">{timerState.remainingTime}</div>
            </div>
            <div className="w-full max-w-[300px] my-8">
              <ProgressBar progress={progress} />
            </div>
          </>
        )}

        {timerState.status === 'complete' && (
          <>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">COMPLETE</div>
            </div>
            <div className="w-full max-w-[300px] mt-8">
              <Button size="large" onClick={() => goToNotes(sessionId, printId)}>
                CONTINUE
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
