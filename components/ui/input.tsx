import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'flex h-11 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 transition focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500',
        className
      )}
      {...props}
    />
  );
}
