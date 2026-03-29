import { useTelegram } from '@/hooks/useTelegram';

export type ModeId = 'chat' | 'transcribe' | 'note';

interface ModeCardProps {
  id: ModeId;
  title: string;
  desc: string;
  icon: string;
  selected: boolean;
  onSelect: (mode: ModeId) => void;
}

export function ModeCard({ id, title, desc, icon, selected, onSelect }: ModeCardProps) {
  const { haptic } = useTelegram();

  const handleClick = () => {
    haptic?.impactOccurred('light');
    onSelect(id);
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left p-5 rounded-2xl border-2 relative overflow-hidden group ${
        selected
          ? 'border-[#8b5cf6] bg-[#8b5cf6]/10'
          : 'border-[#1e1b4b] bg-[#030712]'
      }`}
    >
      <div className="flex items-center gap-5">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
          selected ? 'bg-[#8b5cf6]/20' : 'bg-[#1e1b4b]'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className={`font-black text-lg ${selected ? 'text-[#a78bfa]' : 'text-[#f8fafc]'}`}>
            {title}
          </h3>
          <p className="text-[#64748b] text-sm font-medium mt-0.5">{desc}</p>
        </div>
      </div>
    </button>
  );
}
