import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import ParticleBackground from '@/components/facet/ParticleBackground';
import Logo from '@/components/facet/Logo';
import SettingsPanel from '@/components/facet/SettingsPanel';
import MapSelector from '@/components/facet/MapSelector';
import EloRank from '@/components/facet/EloRank';

const NAV = [
  { label: 'Главная', href: '#top' },
  { label: 'Карты', href: '#maps' },
  { label: 'ELO', href: '#elo' },
  { label: 'Профиль', href: '#profile' },
];

const Index = () => {
  const { theme, update, reset } = useTheme();

  return (
    <div className="app-bg relative min-h-screen overflow-hidden text-foreground">
      <ParticleBackground />

      {/* Nav */}
      <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <Logo size="sm" />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <SettingsPanel theme={theme} update={update} reset={reset} />
      </header>

      {/* Hero */}
      <section
        id="top"
        className="relative z-10 flex min-h-[78vh] flex-col items-center justify-center px-5 text-center"
      >
        <div className="animate-fade-in">
          <span className="glass mb-8 inline-flex items-center gap-2 rounded-full border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-2 w-2 rounded-full" style={{ background: 'hsl(var(--glow))', boxShadow: '0 0 10px hsl(var(--glow))' }} />
            Standoff 2 · Premium League
          </span>
        </div>

        <div className="animate-scale-in">
          <Logo size="lg" />
        </div>

        <p className="mt-6 max-w-xl animate-fade-in text-lg text-muted-foreground [animation-delay:150ms]">
          Соревновательная платформа нового поколения. Играй, поднимайся в рейтинге
          и добивайся статуса легенды.
        </p>

        <div className="mt-10 flex animate-fade-in flex-wrap items-center justify-center gap-4 [animation-delay:300ms]">
          <Button
            size="lg"
            className="h-12 gap-2 rounded-xl px-8 text-base font-semibold glow-ring"
            asChild
          >
            <a href="#elo">
              <Icon name="Zap" size={18} />
              Начать игру
            </a>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="glass h-12 gap-2 rounded-xl border-white/10 px-8 text-base"
            asChild
          >
            <a href="#maps">
              <Icon name="Map" size={18} />
              Выбрать карту
            </a>
          </Button>
        </div>
      </section>

      <MapSelector />
      <EloRank />

      {/* Footer */}
      <footer id="profile" className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-12 pt-8">
        <div className="glass flex flex-col items-center justify-between gap-4 rounded-2xl border-white/10 p-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-sm text-muted-foreground">© 2026 · Premium Gaming</span>
          </div>
          <div className="flex items-center gap-3">
            {['Twitch', 'Youtube', 'Send', 'MessageCircle'].map((ic) => (
              <a
                key={ic}
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-muted-foreground transition-all hover:text-foreground hover:glow-ring"
              >
                <Icon name={ic} size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
