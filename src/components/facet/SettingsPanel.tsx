import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ThemeState } from '@/hooks/use-theme';
import { useLanguage } from '@/hooks/use-language';

interface SettingsPanelProps {
  theme: ThemeState;
  update: (patch: Partial<ThemeState>) => void;
  reset: () => void;
}

const PRESETS = ['#8b5cf6', '#3b82f6', '#22d3ee', '#10b981', '#f97316', '#ef4444', '#ec4899', '#facc15'];

const ColorRow = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-xs font-mono uppercase text-foreground/70">{value}</span>
    </div>
    <div className="flex items-center gap-3">
      <label className="relative h-11 w-11 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-white/10">
        <span className="absolute inset-0" style={{ background: value }} />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="h-7 w-7 rounded-full border border-white/10 transition-transform hover:scale-110"
            style={{ background: c }}
            aria-label={c}
          />
        ))}
      </div>
    </div>
  </div>
);

const SettingsPanel = ({ theme, update, reset }: SettingsPanelProps) => {
  const { t } = useLanguage();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="glass h-11 w-11 rounded-xl border-white/10 hover:glow-ring"
        >
          <Icon name="Settings2" size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="glass w-full border-white/10 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">{t('settings.title')}</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          <ColorRow
            label={t('settings.mainColor')}
            value={theme.color}
            onChange={(v) => update({ color: v })}
          />
          <ColorRow
            label={t('settings.logoColor')}
            value={theme.logoColor}
            onChange={(v) => update({ logoColor: v })}
          />

          <div className="flex items-center justify-between rounded-xl border border-white/10 p-4">
            <div>
              <p className="text-sm font-medium">{t('settings.gradient')}</p>
              <p className="text-xs text-muted-foreground">{t('settings.gradientDesc')}</p>
            </div>
            <Switch
              checked={theme.gradient}
              onCheckedChange={(v) => update({ gradient: v })}
            />
          </div>

          <Button
            variant="ghost"
            onClick={reset}
            className="w-full gap-2 text-muted-foreground hover:text-foreground"
          >
            <Icon name="RotateCcw" size={16} />
            {t('settings.reset')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsPanel;