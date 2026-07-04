import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useLanguage } from '@/hooks/use-language';
import { LANGUAGES } from '@/lib/i18n';

const LanguageSwitcher = () => {
  const { lang, setLang } = useLanguage();
  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="glass h-11 gap-2 rounded-xl border-white/10 px-3 hover:glow-ring"
        >
          <span className="text-base leading-none">{current.flag}</span>
          <span className="hidden text-sm sm:inline">{current.label}</span>
          <Icon name="ChevronDown" size={14} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass min-w-[10rem] border-white/10">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`gap-2 rounded-lg ${lang === l.code ? 'accent-text' : ''}`}
          >
            <span className="text-base leading-none">{l.flag}</span>
            <span className="text-sm">{l.label}</span>
            {lang === l.code && <Icon name="Check" size={14} className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
