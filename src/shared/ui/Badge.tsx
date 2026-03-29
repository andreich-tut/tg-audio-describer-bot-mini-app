import { type ReactNode } from 'react';

export interface BadgeProps {
  children: ReactNode;
  color?: 'zinc' | 'indigo' | 'green';
}

const colors = {
  zinc: 'bg-[#1e1b4b] text-[#94a3b8] border-[#312e81]',
  indigo: 'bg-[#8b5cf6]/10 text-[#a78bfa] border-[#8b5cf6]/20',
  green: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
};

export function Badge({ children, color = 'zinc' }: BadgeProps) {
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black border ${colors[color]} uppercase tracking-widest`}>
      {children}
    </span>
  );
}
