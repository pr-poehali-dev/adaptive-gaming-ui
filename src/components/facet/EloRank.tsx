import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { getFaceitLevel, getRank, rankSpriteStyle } from '@/lib/ranks';

const MIN = 100;
const MAX = 5000;

const EloRank = () => {
  const [elo, setElo] = useState(1250);

  const level = useMemo(() => getFaceitLevel(elo), [elo]);
  const rank = useMemo(() => getRank(elo), [elo]);

  const ringPct = (level / 10) * 100;
  const circumference = 2 * Math.PI * 52;
  const dash = (ringPct / 100) * circumference;

  return (
    <section id="elo" className="mx-auto w-full max-w-5xl px-5 py-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] accent-text">Прогресс</p>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">Faceit ELO</h2>
      </div>

      <div className="glass glow-soft rounded-3xl border border-white/10 p-6 sm:p-10">
        {/* ELO value */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">Текущий ELO</p>
          <p
            className="font-display text-6xl font-bold tabular-nums sm:text-7xl"
            style={{ color: 'hsl(var(--glow))', textShadow: '0 0 40px hsl(var(--glow) / 0.5)' }}
          >
            {elo >= MAX ? '5000+' : elo}
          </p>
        </div>

        {/* Circular level indicator */}
        <div className="my-8 flex justify-center">
          <div className="relative h-32 w-32">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(230 18% 18%)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="hsl(var(--glow))"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                style={{ transition: 'stroke-dasharray 0.5s cubic-bezier(0.22,1,0.36,1)', filter: 'drop-shadow(0 0 8px hsl(var(--glow) / 0.6))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs uppercase text-muted-foreground">Level</span>
              <span className="font-display text-4xl font-bold" style={{ color: 'hsl(var(--glow))' }}>
                {level}
              </span>
            </div>
          </div>
        </div>

        {/* Slider */}
        <div className="mx-auto max-w-xl">
          <Slider
            value={[elo]}
            min={MIN}
            max={MAX}
            step={10}
            onValueChange={(v) => setElo(v[0])}
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>100</span>
            <span>5000+</span>
          </div>
        </div>

        {/* Rank card */}
        <div
          key={rank.name}
          className="mt-10 flex flex-col items-center gap-5 rounded-2xl border border-white/10 p-6 animate-scale-in sm:flex-row sm:gap-8"
          style={{ background: `radial-gradient(120% 120% at 0% 0%, ${rank.color}22, transparent 60%)` }}
        >
          <div
            className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/60 bg-white"
            style={{ boxShadow: `0 0 34px ${rank.color}66` }}
          >
            <div
              className="animate-scale-in will-animate"
              style={rankSpriteStyle(rank, 100)}
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Текущий ранг</p>
            <p className="font-display text-3xl font-bold" style={{ color: rank.color }}>
              {rank.name}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {rank.min} – {rank.max >= 999999 ? '∞' : rank.max} ELO / MMR
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EloRank;