import { ModeCard } from './ModeCard';
import type { ModeId } from './ModeCard';

interface ModeDashboardProps {
  selectedMode: ModeId;
  onModeChange: (mode: ModeId) => void;
}

const modes: { id: ModeId; title: string; desc: string; icon: string }[] = [
  { id: 'chat', title: 'Chat', desc: 'Transcription + AI Response', icon: '💬' },
  { id: 'transcribe', title: 'Transcribe', desc: 'Raw text only', icon: '🎙' },
  { id: 'note', title: 'Note', desc: 'Structured Obsidian Markdown', icon: '📓' }
];

export function ModeDashboard({ selectedMode, onModeChange }: ModeDashboardProps) {
  return (
    <div className="space-y-4 px-4 py-4 pb-20">
      {modes.map((mode) => (
        <ModeCard
          key={mode.id}
          id={mode.id}
          title={mode.title}
          desc={mode.desc}
          icon={mode.icon}
          selected={selectedMode === mode.id}
          onSelect={onModeChange}
        />
      ))}
    </div>
  );
}
