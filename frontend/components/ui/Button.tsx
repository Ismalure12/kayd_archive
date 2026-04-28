import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-mono uppercase tracking-[0.14em] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-ink text-paper border border-ink hover:bg-accent-ink hover:border-accent-ink focus:ring-accent',
    secondary: 'bg-paper-2 border border-rule text-ink hover:bg-paper-3 focus:ring-rule',
    ghost: 'bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper focus:ring-ink',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'text-[10px] px-3 py-1.5 gap-1.5',
    md: 'text-[11px] px-4 py-2 gap-2',
    lg: 'text-[11px] px-6 py-3 gap-2',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
