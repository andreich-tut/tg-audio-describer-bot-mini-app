import { ScreenWrapper } from '@/shared/ui';

interface LanguageConfigProps {
  onBack: () => void;
}

export function LanguageConfig({ onBack }: LanguageConfigProps) {
  return (
    <ScreenWrapper title="Language" onBack={onBack}>
      <div className="h-64 flex items-center justify-center border-2 border-dashed border-[#1e1b4b] rounded-3xl text-[#475569] font-mono text-sm">
        Module Under Construction
      </div>
    </ScreenWrapper>
  );
}
