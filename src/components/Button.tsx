import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'normal' | 'large';
  fullWidth?: boolean;
  children: ReactNode;
}

const baseClasses =
  'font-medium rounded-lg border-2 cursor-pointer transition-colors duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

const variantClasses = {
  primary:
    'bg-transparent text-text-primary border-text-primary hover:bg-bg-elevated',
  secondary:
    'bg-transparent text-text-secondary border-border hover:bg-bg-secondary hover:border-text-secondary',
  danger:
    'bg-transparent text-text-primary border-text-primary hover:bg-bg-elevated',
};

const sizeClasses = {
  normal: 'text-lg py-4 px-6 min-h-14',
  large: 'text-xl py-5 px-8 min-h-16',
};

export function Button({
  variant = 'primary',
  size = 'normal',
  fullWidth = true,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
