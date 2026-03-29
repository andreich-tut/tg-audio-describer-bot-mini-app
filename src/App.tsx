import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSettings } from '@/hooks/useSettings';
import { useOAuthSSE } from '@/hooks/useOAuthSSE';
import { ModeDashboard, useModeSelection } from '@/features/ModeSelection';
import { 
  SettingsDirectory, 
  LLMConfig, 
  VaultConfig, 
  ObsidianConfig, 
  LanguageConfig, 
  DesignTokens,
  type SettingsView 
} from '@/features/Settings';
import { BottomNav, type Tab } from '@/shared/layout';
import './theme.css';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1 } },
});

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('Mode');
  const { isLoading, error } = useSettings();
  const { selectedMode, setMode } = useModeSelection('chat');
  const tg = window.Telegram?.WebApp;
  const initData = tg?.initData || '';
  useOAuthSSE(initData);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  if (isLoading) return <div className="p-10 text-center text-[#64748b]">Loading…</div>;
  if (error) return <div className="p-10 text-center text-rose-400">Failed to load</div>;

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-[#f8fafc] flex flex-col">
      {/* Dynamic Screen Content */}
      <main className="flex-1 relative overflow-hidden">
        {activeTab === 'Mode' ? (
          <ModeDashboard selectedMode={selectedMode} onModeChange={setMode} />
        ) : (
          <SettingsViews />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}

// Settings views manager component
function SettingsViews() {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const { refetch } = useSettings();

  const handleNavigate = (view: SettingsView) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('main');
  };

  if (currentView === 'main') {
    return <SettingsDirectory onNavigate={handleNavigate} />;
  }

  if (currentView === 'llm') {
    return <LLMConfig onBack={handleBack} />;
  }

  if (currentView === 'vault') {
    return <VaultConfig onBack={handleBack} onRefresh={refetch} />;
  }

  if (currentView === 'obsidian') {
    return <ObsidianConfig onBack={handleBack} />;
  }

  if (currentView === 'lang') {
    return <LanguageConfig onBack={handleBack} />;
  }

  if (currentView === 'kit') {
    return <DesignTokens onBack={handleBack} />;
  }

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
