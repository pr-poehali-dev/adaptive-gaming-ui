import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { MAPS } from '@/lib/ranks';

const MapSelector = () => {
  const [selected, setSelected] = useState<string>('prison');

  return (
    <section id="maps" className="mx-auto w-full max-w-6xl px-5 py-20">
      <div className="mb-10 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] accent-text">Арсенал</p>
        <h2 className="font-display text-4xl font-bold sm:text-5xl">Выбор карты</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {MAPS.map((map) => {
          const active = selected === map.id;
          return (
            <button
              key={map.id}
              onClick={() => setSelected(map.id)}
              className={`will-animate group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500 ease-out ${
                active
                  ? 'glass scale-[1.04] border-white/20 glow-ring'
                  : 'glass border-white/5 opacity-60 hover:opacity-90'
              }`}
            >
              <div
                className={`mb-14 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-500 ${
                  active ? 'text-white' : 'text-muted-foreground'
                }`}
                style={{
                  background: active
                    ? 'hsl(var(--glow) / 0.9)'
                    : 'hsl(230 18% 16%)',
                  boxShadow: active ? '0 0 24px hsl(var(--glow) / 0.5)' : 'none',
                }}
              >
                <Icon name={map.icon} size={24} />
              </div>

              <p className="font-display text-lg font-semibold">{map.name}</p>
              <p className="text-xs text-muted-foreground">{map.mode}</p>

              {active && (
                <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-black animate-scale-in">
                  <Icon name="Check" size={14} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MapSelector;
