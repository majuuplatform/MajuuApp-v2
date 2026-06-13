import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface TypographyProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'heading' | 'subtle' | 'body';
}

export function Typography({ className, variant = 'body', ...props }: TypographyProps) {
  return (
    <div
      className={cn(
        variant === 'heading' ? 'text-2xl font-semibold text-white' : variant === 'subtle' ? 'text-sm text-slate-400' : 'text-base text-slate-200',
        className
      )}
      {...props}
    />
  );
}
