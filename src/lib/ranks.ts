import type { CSSProperties } from 'react';

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

export const RANK_SPRITE = 'https://cdn.poehali.dev/projects/2cc7558e-c16a-439f-8cb0-2eb764f212d0/bucket/0ee6f227-bea9-4dcb-8dc7-12867ea1de25.png';

/** Sprite grid geometry: 8 columns x 3 rows */
export const SPRITE_COLS = 8;
export const SPRITE_ROWS = 3;

export interface Rank {
  name: string;
  min: number;
  max: number;
  color: string;
  /** column index in the 8-col sprite grid (fractional for centered row) */
  col: number;
  /** row index in the 3-row sprite grid */
  row: number;
}

/**
 * Row 0: Bronze I-IV, Silver I-IV (cols 0-7)
 * Row 1: Gold I-IV, Gold Elite I-III (cols 0-6)
 * Row 2: Master, Elite, Diamond (centered -> cols 2.5, 3.5, 4.5)
 */
export const RANKS: Rank[] = [
  { name: 'Bronze I', min: 100, max: 250, color: '#c58a4f', col: 0, row: 0 },
  { name: 'Bronze II', min: 251, max: 400, color: '#c58a4f', col: 1, row: 0 },
  { name: 'Bronze III', min: 401, max: 550, color: '#c58a4f', col: 2, row: 0 },
  { name: 'Bronze IV', min: 551, max: 700, color: '#c58a4f', col: 3, row: 0 },
  { name: 'Silver I', min: 701, max: 850, color: '#c4ccd8', col: 4, row: 0 },
  { name: 'Silver II', min: 851, max: 1000, color: '#c4ccd8', col: 5, row: 0 },
  { name: 'Silver III', min: 1001, max: 1150, color: '#c4ccd8', col: 6, row: 0 },
  { name: 'Silver IV', min: 1151, max: 1300, color: '#c4ccd8', col: 7, row: 0 },
  { name: 'Gold I', min: 1301, max: 1450, color: '#f2c14e', col: 0, row: 1 },
  { name: 'Gold II', min: 1451, max: 1600, color: '#f2c14e', col: 1, row: 1 },
  { name: 'Gold III', min: 1601, max: 1750, color: '#f2c14e', col: 2, row: 1 },
  { name: 'Gold IV', min: 1751, max: 1900, color: '#f2c14e', col: 3, row: 1 },
  { name: 'Gold Elite I', min: 1901, max: 2100, color: '#ffd633', col: 4, row: 1 },
  { name: 'Gold Elite II', min: 2101, max: 2300, color: '#ffd633', col: 5, row: 1 },
  { name: 'Gold Elite III', min: 2301, max: 2600, color: '#ffd633', col: 6, row: 1 },
  { name: 'Master', min: 2601, max: 3200, color: '#8b8cff', col: 2.5, row: 2 },
  { name: 'Elite', min: 3201, max: 4000, color: '#a78bfa', col: 3.5, row: 2 },
  { name: 'Diamond', min: 4001, max: 999999, color: '#b3aaff', col: 4.5, row: 2 },
];

/** CSS background props to crop a single rank icon from the sprite */
export function rankSpriteStyle(rank: Rank, boxSize: number): CSSProperties {
  const bgWidth = boxSize * SPRITE_COLS;
  const bgHeight = boxSize * SPRITE_ROWS;
  return {
    backgroundImage: `url(${RANK_SPRITE})`,
    backgroundSize: `${bgWidth}px ${bgHeight}px`,
    backgroundPosition: `-${rank.col * boxSize}px -${rank.row * boxSize}px`,
    backgroundRepeat: 'no-repeat',
    width: boxSize,
    height: boxSize,
  };
}

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