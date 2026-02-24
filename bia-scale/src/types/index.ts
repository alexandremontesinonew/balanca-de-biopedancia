// BIA Scale App — Types

export interface User {
  id: number;
  name: string;
  birthdate: string; // ISO date YYYY-MM-DD
  age: number;
  height_cm: number;
  sex: 'male' | 'female';
  activity_level: 1 | 2 | 3 | 4 | 5;
  created_at: string;
  updated_at: string;
}

export interface Measurement {
  id: number;
  user_id: number;
  datetime: string; // ISO datetime
  weight_kg: number;
  bmi: number;
  body_fat_pct: number;
  fat_weight_kg: number;
  skeletal_muscle_pct: number;
  skeletal_muscle_weight_kg: number;
  muscle_rate_pct: number;
  muscle_weight_kg: number;
  water_pct: number;
  water_weight_kg: number;
  visceral_fat: number;
  bone_weight_kg: number;
  bmr: number;
  protein_pct: number;
  obesity_pct: number;
  metabolic_age: number;
  lbm_kg: number;
  real_age: number;
  height_cm: number;
  raw_impedance?: number;
  created_at: string;
}

export interface Device {
  id: number;
  user_id: number;
  name: string;
  mac: string;
  manufacturer?: string;
  phone?: string;
  address?: string;
  created_at: string;
}

export interface WaterIntake {
  id: number;
  user_id: number;
  date: string; // YYYY-MM-DD
  amount_ml: number;
  beverage_type: string;
  created_at: string;
}

export interface FamilyMember {
  id: number;
  owner_id: number;
  name: string;
  birthdate: string;
  height_cm: number;
  sex: 'male' | 'female';
  created_at: string;
}

export type MetricClassification =
  | 'Excelente'
  | 'Saudável'
  | 'Alto'
  | 'Baixo'
  | 'Obeso'
  | 'Grave';

export interface MetricResult {
  value: number;
  classification: MetricClassification | null;
  badgeColor: string | null;
}
