import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label htmlFor={inputId} className="text-sm text-text-secondary font-medium">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className="text-lg py-3.5 px-4 bg-bg-secondary border-2 border-border rounded-lg text-text-primary min-h-13 transition-colors duration-150 focus:outline-none focus:border-accent placeholder:text-text-muted disabled:opacity-50 disabled:cursor-not-allowed appearance-none"
          {...props}
        />
        {hint && <span className="text-xs text-text-muted">{hint}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
