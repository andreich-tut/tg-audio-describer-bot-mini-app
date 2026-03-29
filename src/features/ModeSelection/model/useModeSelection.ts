import { useState } from 'react';
import type { ModeId } from '../ui/ModeCard';

export function useModeSelection(initialMode: ModeId = 'chat') {
  const [selectedMode, setSelectedMode] = useState<ModeId>(initialMode);

  const setMode = (mode: ModeId) => {
    setSelectedMode(mode);
  };

  return {
    selectedMode,
    setMode
  };
}
