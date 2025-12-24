import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
}

export function Header({ title, leftAction, rightAction }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-bg-primary border-b border-border min-h-15">
      <div className="min-w-15 flex items-center justify-start">{leftAction}</div>
      <h1 className="text-lg font-semibold text-text-primary text-center">{title}</h1>
      <div className="min-w-15 flex items-center justify-end">{rightAction}</div>
    </header>
  );
}

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      className="bg-transparent border-none text-text-secondary text-base p-2 cursor-pointer min-h-11 min-w-11 flex items-center hover:text-text-primary"
      onClick={onClick}
      aria-label="Go back"
    >
      &larr; Back
    </button>
  );
}

interface IconButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

export function IconButton({ icon, label, onClick }: IconButtonProps) {
  return (
    <button
      className="bg-transparent border-none text-text-secondary text-xl p-2 cursor-pointer min-h-12 min-w-12 flex items-center justify-center hover:text-text-primary"
      onClick={onClick}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
