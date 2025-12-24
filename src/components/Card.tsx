import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated';
  padding?: 'normal' | 'compact';
}

const variantClasses = {
  default: 'bg-bg-secondary',
  elevated: 'bg-bg-elevated',
};

const paddingClasses = {
  normal: 'p-4',
  compact: 'p-3',
};

export function Card({
  children,
  variant = 'default',
  padding = 'normal',
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
