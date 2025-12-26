interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(clampedProgress * 100);

  return (
    <div className="w-full">
      <div className="relative h-1 bg-bg-elevated rounded overflow-visible">
        <div
          className="h-full bg-accent rounded transition-[width] duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-text-primary rounded-full transition-[left] duration-300 ease-out"
          style={{ left: `${percentage}%` }}
        />
      </div>
      {label && <div className="text-sm text-text-muted mt-2 text-center">{label}</div>}
    </div>
  );
}
