import { Eye, EyeOff } from 'lucide-react';

export interface InputGroupProps {
  label: string;
  value: string;
  type?: 'text' | 'password';
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isGeist?: boolean;
  showEye?: boolean;
  onToggleEye?: () => void;
}

export function InputGroup({ 
  label, 
  value, 
  type = 'text', 
  onChange, 
  isGeist = false, 
  showEye, 
  onToggleEye 
}: InputGroupProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[10px] font-bold text-[#475569] uppercase tracking-[0.15em] ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={showEye ? (type === 'password' ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          className={`w-full bg-[#020617] border border-[#1e1b4b] rounded-xl px-4 py-3 text-sm text-[#f8fafc] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/40 focus:border-[#8b5cf6] transition-all placeholder-[#334155] ${isGeist ? 'font-mono' : 'font-sans'}`}
        />
        {showEye && onToggleEye && (
          <button
            type="button"
            onClick={onToggleEye}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#f8fafc] transition-colors"
          >
            {type === 'password' ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
    </div>
  );
}
