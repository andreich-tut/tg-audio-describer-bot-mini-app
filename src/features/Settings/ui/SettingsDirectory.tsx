import { ChevronRight, Cpu, Cloud, Globe } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';

export type SettingsView = 'main' | 'llm' | 'vault' | 'obsidian' | 'lang' | 'kit' | 'model-selection';

interface SettingsNavItem {
  id: SettingsView;
  label: string;
  sub: string;
  icon: typeof Cpu;
  color: string;
}

interface SettingsDirectoryProps {
  onNavigate: (view: SettingsView) => void;
}

const items: SettingsNavItem[] = [
  { id: 'llm', label: 'AI Engine (LLMs)', sub: 'Configuration', icon: Cpu, color: 'text-cyan-400' },
  { id: 'vault', label: 'Cloud Vault', sub: 'Yandex Integration', icon: Cloud, color: 'text-blue-400' },
  { id: 'lang', label: 'Language', sub: 'RU / EN', icon: Globe, color: 'text-emerald-400' }
];

export function SettingsDirectory({ onNavigate }: SettingsDirectoryProps) {
  const { haptic } = useTelegram();

  const handleNavigate = (view: SettingsView) => {
    haptic?.impactOccurred('light');
    onNavigate(view);
  };

  return (
    <div className="space-y-3 px-4 py-4 pb-20">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => handleNavigate(item.id)}
          className="w-full flex items-center justify-between p-4 bg-[#030712] border border-[#1e1b4b] rounded-2xl hover:border-[#8b5cf6]/40 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl bg-[#1e1b4b]/50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon size={22} />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#f8fafc]">{item.label}</div>
              <div className="text-[11px] font-semibold text-[#475569]">{item.sub}</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#334155] group-hover:text-[#8b5cf6] transition-colors" />
        </button>
      ))}
    </div>
  );
}
