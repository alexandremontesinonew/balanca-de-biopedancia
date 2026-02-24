export { Colors, Spacing, BorderRadius, FontSize } from './theme';

// Seed data — medição real do Alexandre
export const SEED_USER = {
  name: 'xmontesino',
  birthdate: '1983-01-01',
  age: 43,
  height_cm: 180,
  sex: 'male' as const,
  activity_level: 3 as const,
};

export const SEED_DEVICE = {
  name: 'Balança Bluetooth1',
  mac: '50:E4:52:A2:3E:4C',
};

export const SEED_MEASUREMENT = {
  datetime: '2026-02-24T09:40:32',
  weight_kg: 113.75,
  bmi: 35.1,
  body_fat_pct: 34.7,
  fat_weight_kg: 39.5,
  skeletal_muscle_pct: 33.0,
  skeletal_muscle_weight_kg: 37.5,
  muscle_rate_pct: 61.5,
  muscle_weight_kg: 70.0,
  water_pct: 48.8,
  water_weight_kg: 55.5,
  visceral_fat: 27.0,
  bone_weight_kg: 4.0,
  bmr: 2143.6,
  protein_pct: 12.8,
  obesity_pct: 62.5,
  metabolic_age: 52.0,
  lbm_kg: 74.29,
  real_age: 42,
  height_cm: 180,
};

export const SEED_PREVIOUS_MEASUREMENT = {
  date: '2026-02-23',
  weight_delta: -1.6,
};

export const WATER_GOAL_ML = 2637;
export const CALORIE_GOAL = 2073;

export const WEIGHT_THRESHOLDS_180CM = {
  underweight_max: 59.94,
  healthy_max: 80.68,
  overweight_max: 96.88,
};
