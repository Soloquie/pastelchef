export type ShapeId = 'round' | 'square' | 'heart' | 'hexagon';
export type SpongeId = 'vanilla' | 'chocolate' | 'red_velvet' | 'carrot_spice';
export type FillingId = 'berry_compote' | 'chocolate_ganache' | 'dulce_de_leche' | 'passionfruit_curd';
export type FrostingId = 'silk_buttercream' | 'chocolate_mirror' | 'blush_rose' | 'matcha_pistachio';
export type ToppingId = 'fresh_berries' | 'gold_pearls' | 'edible_flowers' | 'macarons' | 'chocolate_shavings' | 'candles';

export interface CakeShapeOption {
  id: ShapeId;
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  badge: string;
}

export interface CakeSpongeOption {
  id: SpongeId;
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  color: string;
  crumbColor: string;
  flavorVibe: string;
}

export interface CakeFillingOption {
  id: FillingId;
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  color: string;
  accentColor: string;
}

export interface CakeFrostingOption {
  id: FrostingId;
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  color: string;
  accentColor: string;
  finish: string;
}

export interface CakeToppingOption {
  id: ToppingId;
  name: string;
  emoji: string;
  subtitle: string;
  description: string;
  categoryName: string;
}

export interface CustomCake {
  id: string;
  name: string;
  currentStep: number; // 1 to 6
  shapeId: ShapeId;
  spongeId: SpongeId;
  fillingId: FillingId;
  frostingId: FrostingId;
  toppingIds: ToppingId[];
  customMessage: string;
  candlesLit: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BuilderStep = 1 | 2 | 3 | 4 | 5 | 6;

export interface StepMeta {
  step: BuilderStep;
  title: string;
  shortTitle: string;
  emoji: string;
  description: string;
  actionPrompt: string;
}
