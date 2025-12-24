import { formatSeconds } from '../utils/time';

interface TimerDisplayProps {
  seconds: number;
  label?: string;
  sublabel?: string;
}

export function TimerDisplay({ seconds, label, sublabel }: TimerDisplayProps) {
  return (
    <div className="text-center p-6">
      {label && (
        <div className="text-xl text-text-secondary uppercase tracking-widest mb-2">
          {label}
        </div>
      )}
      <div className="text-timer font-bold text-text-primary tabular-nums leading-none">
        {formatSeconds(seconds)}
      </div>
      {sublabel && (
        <div className="text-lg text-text-muted mt-3">{sublabel}</div>
      )}
    </div>
  );
}
