export interface FaceitLevel {
  level: number;
  min: number;
  max: number;
}

export const FACEIT_LEVELS: FaceitLevel[] = [
  { level: 1, min: 100, max: 500 },
  { level: 2, min: 501, max: 750 },
  { level: 3, min: 751, max: 900 },
  { level: 4, min: 901, max: 1050 },
  { level: 5, min: 1051, max: 1200 },
  { level: 6, min: 1201, max: 1300 },
  { level: 7, min: 1301, max: 1530 },
  { level: 8, min: 1531, max: 1750 },
  { level: 9, min: 1751, max: 2000 },
  { level: 10, min: 2001, max: 999999 },
];

export function getFaceitLevel(elo: number): number {
  const found = FACEIT_LEVELS.find((l) => elo >= l.min && elo <= l.max);
  return found ? found.level : 10;
}

export interface Rank {
  name: string;
  min: number;
  max: number;
  icon: string;
  color: string;
}

export const RANKS: Rank[] = [
  { name: 'Bronze I', min: 100, max: 250, icon: 'Shield', color: '#a97142' },
  { name: 'Bronze II', min: 251, max: 400, icon: 'Shield', color: '#b5814f' },
  { name: 'Bronze III', min: 401, max: 550, icon: 'Shield', color: '#c08a54' },
  { name: 'Bronze IV', min: 551, max: 700, icon: 'Shield', color: '#cd9760' },
  { name: 'Silver I', min: 701, max: 850, icon: 'ShieldHalf', color: '#b9c0cc' },
  { name: 'Silver II', min: 851, max: 1000, icon: 'ShieldHalf', color: '#c4ccd8' },
  { name: 'Silver III', min: 1001, max: 1150, icon: 'ShieldHalf', color: '#cfd7e3' },
  { name: 'Silver IV', min: 1151, max: 1300, icon: 'ShieldHalf', color: '#dae2ee' },
  { name: 'Gold I', min: 1301, max: 1450, icon: 'ShieldCheck', color: '#f2c14e' },
  { name: 'Gold II', min: 1451, max: 1600, icon: 'ShieldCheck', color: '#f6c94a' },
  { name: 'Gold III', min: 1601, max: 1750, icon: 'ShieldCheck', color: '#f9d13f' },
  { name: 'Gold IV', min: 1751, max: 1900, icon: 'ShieldCheck', color: '#ffd633' },
  { name: 'Phoenix', min: 1901, max: 2200, icon: 'Flame', color: '#ff6b35' },
  { name: 'Ranger', min: 2201, max: 2600, icon: 'Crosshair', color: '#2dd4bf' },
  { name: 'Champion', min: 2601, max: 3100, icon: 'Trophy', color: '#38bdf8' },
  { name: 'Master', min: 3101, max: 3800, icon: 'Crown', color: '#c084fc' },
  { name: 'Elite', min: 3801, max: 4600, icon: 'Gem', color: '#f472b6' },
  { name: 'The Legend', min: 4601, max: 999999, icon: 'Sparkles', color: '#fbbf24' },
];

export function getRank(elo: number): Rank {
  const found = RANKS.find((r) => elo >= r.min && elo <= r.max);
  return found ?? RANKS[RANKS.length - 1];
}

export interface GameMap {
  id: string;
  name: string;
  mode: string;
  icon: string;
}

export const MAPS: GameMap[] = [
  { id: 'prison', name: 'Prison', mode: 'Defuse', icon: 'Lock' },
  { id: 'hanami', name: 'Hanami', mode: 'Defuse', icon: 'Flower2' },
  { id: 'rust', name: 'Rust', mode: 'Team Deathmatch', icon: 'Wrench' },
  { id: 'dune', name: 'Dune', mode: 'Defuse', icon: 'Mountain' },
  { id: 'breeze', name: 'Breeze', mode: 'Defuse', icon: 'Wind' },
  { id: 'province', name: 'Province', mode: 'Defuse', icon: 'TreePine' },
  { id: 'sandstone', name: 'Sandstone', mode: 'Defuse', icon: 'Pyramid' },
];
