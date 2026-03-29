import { useState } from 'react';
import type { SettingsView } from '../ui/SettingsDirectory';

export function useSettingsNavigation() {
  const [currentView, setCurrentView] = useState<SettingsView>('main');

  const navigate = (view: SettingsView) => {
    setCurrentView(view);
  };

  const goBack = () => {
    setCurrentView('main');
  };

  return {
    currentView,
    navigate,
    goBack
  };
}
