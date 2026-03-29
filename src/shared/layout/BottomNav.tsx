import { useTelegram } from '@/hooks/useTelegram';

export type Tab = 'Mode' | 'Settings';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSettingsNavigate?: () => void;
}

export function BottomNav({ activeTab, onTabChange, onSettingsNavigate }: BottomNavProps) {
  const { haptic } = useTelegram();

  const handleTabClick = (tab: Tab) => {
    haptic?.impactOccurred('light');
    onTabChange(tab);
    if (tab === 'Settings' && onSettingsNavigate) {
      onSettingsNavigate();
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-[#030712]/95 backdrop-blur-xl border-t border-[#1e1b4b] flex items-center justify-center z-30">
      {(['Mode', 'Settings'] as Tab[]).map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`relative flex flex-col items-center justify-center h-full px-8 transition-colors ${
            activeTab === tab ? 'text-[#a78bfa]' : 'text-[#475569]'
          }`}
        >
          <span className={`text-sm font-black uppercase tracking-[0.15em] ${activeTab === tab ? 'border-b-2 border-[#8b5cf6] pb-1' : ''}`}>
            {tab}
          </span>
        </button>
      ))}
    </nav>
  );
}
