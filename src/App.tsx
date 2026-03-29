import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSettings } from '@/hooks/useSettings';
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

  // Telegram WebApp integration
  const tg = window.Telegram?.WebApp;
  const initData = tg?.initData || '';

  // Debug info (remove after testing)
  const [showDebug, setShowDebug] = useState(true);
  if (showDebug && import.meta.env.PROD) {
    return (
      <div className="min-h-screen bg-[#020617] text-white p-4">
        <div className="mb-4 p-4 bg-slate-800 rounded">
          <h2 className="text-lg font-bold mb-2">Debug Info</h2>
          <div className="text-sm space-y-1">
            <div>Telegram: {window.Telegram ? '✅' : '❌'}</div>
            <div>WebApp: {tg ? '✅' : '❌'}</div>
            <div>initData: {initData ? `✅ (${initData.length} chars)` : '❌ EMPTY'}</div>
            <div>User: {tg?.initDataUnsafe?.user?.username || 'not logged in'}</div>
          </div>
          <button
            onClick={() => setShowDebug(false)}
            className="mt-3 px-3 py-1 bg-violet-600 rounded text-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
  };

  if (isLoading) return <div className="p-10 text-center text-[#64748b]">Loading…</div>;
  if (error) {
    return (
      <div className="p-10 text-center">
        <div className="text-rose-400 mb-4">Failed to load</div>
        <div className="text-sm text-slate-500 mb-4">
          Error: {error instanceof Error ? error.message : String(error)}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-violet-600 rounded text-sm"
        >
          Reload
        </button>
      </div>
    );
  }

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
