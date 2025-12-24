import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, hint, className = '', id, ...props }, ref) => {
    const selectId = id ?? `select-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label htmlFor={selectId} className="text-sm text-text-secondary font-medium">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className="w-full text-lg py-3.5 pl-4 pr-10 bg-bg-secondary border-2 border-border rounded-lg text-text-primary min-h-13 appearance-none cursor-pointer transition-colors duration-150 focus:outline-none focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none">
            ▼
          </span>
        </div>
        {hint && <span className="text-xs text-text-muted">{hint}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
