import { type ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

export interface ScreenWrapperProps {
  children: ReactNode;
  title: string;
  onBack?: () => void;
  footer?: ReactNode;
}

export function ScreenWrapper({ children, title, onBack, footer }: ScreenWrapperProps) {
  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="p-4 flex items-center gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-[#1e1b4b]/50 flex items-center justify-center text-[#94a3b8] hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <h1 className="text-2xl font-black tracking-tight text-[#f8fafc] m-0">{title}</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-[80px]">
        {children}
      </div>
      {footer && (
        <div className="absolute bottom-14 left-0 right-0 p-4 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent z-10">
          {footer}
        </div>
      )}
    </div>
  );
}
