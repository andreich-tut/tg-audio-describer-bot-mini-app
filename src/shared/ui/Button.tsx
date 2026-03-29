import { type ReactNode, type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline';
  className?: string;
}

const variants = {
  primary: 'bg-[#8b5cf6] text-white hover:opacity-90 active:scale-95 shadow-[0_0_15px_rgba(139,92,246,0.3)]',
  secondary: 'bg-[#1e1b4b]/50 text-[#a5b4fc] border border-[#312e81] hover:bg-[#312e81]/50',
  destructive: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20',
  ghost: 'bg-transparent text-[#64748b] hover:text-[#f8fafc] hover:bg-[#1e1b4b]/30',
  outline: 'bg-transparent border border-[#1e1b4b] text-[#f8fafc] hover:bg-[#1e1b4b]/40'
};

export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`px-4 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
