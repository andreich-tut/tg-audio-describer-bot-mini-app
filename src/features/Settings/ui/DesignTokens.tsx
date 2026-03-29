import { ScreenWrapper, Button, Badge } from '@/shared/ui';

interface DesignTokensProps {
  onBack: () => void;
}

export function DesignTokens({ onBack }: DesignTokensProps) {
  return (
    <ScreenWrapper title="UI Tokens" onBack={onBack}>
      <div className="space-y-8 pt-2">
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-[#475569] uppercase tracking-[0.2em]">
            Button Styles
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Button className="text-xs">Primary</Button>
            <Button variant="secondary" className="text-xs">Secondary</Button>
            <Button variant="outline" className="text-xs">Outline</Button>
            <Button variant="destructive" className="text-xs">Danger</Button>
          </div>
        </section>
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-[#475569] uppercase tracking-[0.2em]">
            States
          </h4>
          <div className="flex gap-2">
            <Badge color="indigo">Syncing</Badge>
            <Badge color="green">Secure</Badge>
            <Badge>Default</Badge>
          </div>
        </section>
      </div>
    </ScreenWrapper>
  );
}
