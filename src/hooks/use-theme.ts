import { useEffect, useState, useCallback } from 'react';

export interface ThemeState {
  color: string;
  logoColor: string;
  gradient: boolean;
}

const STORAGE_KEY = 'facet-theme-v1';

const DEFAULT_THEME: ThemeState = {
  color: '#8b5cf6',
  logoColor: '#8b5cf6',
  gradient: true,
};

function hexToHsl(hex: string): [number, number, number] {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let hue = 0;
  let sat = 0;
  const light = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    sat = light > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: hue = (g - b) / d + (g < b ? 6 : 0); break;
      case g: hue = (b - r) / d + 2; break;
      default: hue = (r - g) / d + 4;
    }
    hue /= 6;
  }
  return [Math.round(hue * 360), Math.round(sat * 100), Math.round(light * 100)];
}

function applyTheme(theme: ThemeState) {
  const root = document.documentElement;
  const [h, s, l] = hexToHsl(theme.color);
  root.style.setProperty('--accent-h', `${h}`);
  root.style.setProperty('--accent-s', `${s}%`);
  root.style.setProperty('--accent-l', `${l}%`);
  root.style.setProperty('--glow', `${h} ${s}% ${l}%`);

  const [lh, ls, ll] = hexToHsl(theme.logoColor);
  root.style.setProperty('--logo-glow', `${lh} ${ls}% ${ll}%`);

  root.style.setProperty('--gradient-on', theme.gradient ? '1' : '0');
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_THEME, ...JSON.parse(saved) };
    } catch { /* noop */ }
    return DEFAULT_THEME;
  });

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch { /* noop */ }
  }, [theme]);

  const update = useCallback((patch: Partial<ThemeState>) => {
    setTheme((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setTheme(DEFAULT_THEME), []);

  return { theme, update, reset };
}
