import { Colors } from '@/src/constants/theme';
import type { MetricClassification, MetricResult } from '@/src/types';

// ─── Tipos auxiliares ────────────────────────────────────────────────────────

interface CalcInput {
  weight_kg: number;
  height_cm: number;
  age: number;
  sex: 'male' | 'female';
  activity_level?: number;
  raw_impedance?: number;
}

// ─── Fórmulas de cálculo ─────────────────────────────────────────────────────

/** IMC = peso / (altura em metros)² */
export function calcBMI(weight_kg: number, height_cm: number): number {
  const h = height_cm / 100;
  return +(weight_kg / (h * h)).toFixed(1);
}

/** Gordura corporal % — Fórmula Deurenberg para BIA */
export function calcBodyFatPct(
  weight_kg: number,
  height_cm: number,
  age: number,
  sex: 'male' | 'female'
): number {
  const bmi = calcBMI(weight_kg, height_cm);
  const sexFactor = sex === 'male' ? 1 : 0;
  // Deurenberg: %BF = 1.20*BMI + 0.23*age - 10.8*sex - 5.4
  const fat = 1.2 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4;
  return +Math.max(0, fat).toFixed(1);
}

/** Gordura (Kg) */
export function calcFatWeightKg(weight_kg: number, body_fat_pct: number): number {
  return +(weight_kg * body_fat_pct / 100).toFixed(1);
}

/** LBM — Lean Body Mass (Kg) */
export function calcLBM(weight_kg: number, body_fat_pct: number): number {
  return +(weight_kg * (1 - body_fat_pct / 100)).toFixed(2);
}

/** Massa muscular esquelética % — Janssen et al. */
export function calcSkeletalMusclePct(
  weight_kg: number,
  height_cm: number,
  age: number,
  sex: 'male' | 'female',
  raw_impedance?: number
): number {
  const R = raw_impedance ?? 500; // impedância estimada
  const sexFactor = sex === 'male' ? 1 : 0;
  // Janssen: SM(kg) = (height²/R)*0.401 + sex*3.825 - age*0.071 + 5.102
  const smKg = (height_cm * height_cm / R) * 0.401 + sexFactor * 3.825 - age * 0.071 + 5.102;
  return +(smKg / weight_kg * 100).toFixed(1);
}

/** Massa muscular esquelética (Kg) */
export function calcSkeletalMuscleKg(weight_kg: number, skeletal_muscle_pct: number): number {
  return +(weight_kg * skeletal_muscle_pct / 100).toFixed(1);
}

/** Registro de massa muscular % (muscle rate) — proporção do LBM que é músculo */
export function calcMuscleRatePct(
  muscle_weight_kg: number,
  weight_kg: number
): number {
  return +(muscle_weight_kg / weight_kg * 100).toFixed(1);
}

/** Massa muscular total (Kg) ≈ LBM * 0.94 */
export function calcMuscleWeightKg(lbm_kg: number): number {
  return +(lbm_kg * 0.94).toFixed(1);
}

/** Água % — Fórmula de Watson */
export function calcWaterPct(
  weight_kg: number,
  height_cm: number,
  age: number,
  sex: 'male' | 'female'
): number {
  let water_L: number;
  if (sex === 'male') {
    water_L = -2.097 + 0.1069 * height_cm + 0.2466 * weight_kg;
  } else {
    water_L = -2.097 + 0.1069 * height_cm + 0.2466 * weight_kg - 2.097 + 0.1069 * height_cm;
    water_L = -2.097 + 0.1069 * height_cm + 0.2466 * weight_kg;
  }
  return +(water_L / weight_kg * 100).toFixed(1);
}

/** Água (Kg) */
export function calcWaterKg(weight_kg: number, water_pct: number): number {
  return +(weight_kg * water_pct / 100).toFixed(1);
}

/** Gordura visceral — estimativa por BIA */
export function calcVisceralFat(
  weight_kg: number,
  height_cm: number,
  age: number,
  sex: 'male' | 'female'
): number {
  const bmi = calcBMI(weight_kg, height_cm);
  const sexAdj = sex === 'male' ? 1 : 0;
  // estimativa empírica
  const vf = (bmi - 18.5) * 0.7 + age * 0.15 + sexAdj * 3;
  return +Math.max(1, vf).toFixed(0);
}

/** Ossos (Kg) — estimativa por LBM */
export function calcBoneKg(lbm_kg: number): number {
  // Aproximadamente 4% do LBM
  return +(lbm_kg * 0.04).toFixed(1);
}

/** BMR — Mifflin-St Jeor */
export function calcBMR(
  weight_kg: number,
  height_cm: number,
  age: number,
  sex: 'male' | 'female'
): number {
  let bmr: number;
  if (sex === 'male') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }
  return +bmr.toFixed(1);
}

/** Proteína % ≈ LBM * 0.20 / peso total */
export function calcProteinPct(lbm_kg: number, weight_kg: number): number {
  return +(lbm_kg * 0.20 / weight_kg * 100).toFixed(1);
}

/** Obesidade % = (peso - peso_saudavel_max) / peso_saudavel_max * 100 */
export function calcObesityPct(weight_kg: number, height_cm: number): number {
  const h = height_cm / 100;
  const healthyMax = 24.9 * h * h; // BMI 24.9 = topo do saudável
  const pct = (weight_kg - healthyMax) / healthyMax * 100;
  return +Math.max(0, pct).toFixed(1);
}

/** Idade metabólica — baseada no BMR vs. BMR médio por idade */
export function calcMetabolicAge(
  bmr: number,
  sex: 'male' | 'female'
): number {
  // BMR médio decresce ~7 kcal/ano após 30 anos
  const baseBMR = sex === 'male' ? 2000 : 1600;
  const age = Math.round((baseBMR - bmr) / 7 + 30);
  return Math.max(18, Math.min(90, age));
}

// ─── Thresholds de peso por altura ──────────────────────────────────────────

export function calcWeightThresholds(height_cm: number): {
  underweight_max: number;
  healthy_max: number;
  overweight_max: number;
} {
  const h = height_cm / 100;
  return {
    underweight_max: +(18.5 * h * h).toFixed(2),
    healthy_max: +(24.9 * h * h).toFixed(2),
    overweight_max: +(29.9 * h * h).toFixed(2),
  };
}

// ─── Cálculo completo (todas as 19 métricas) ────────────────────────────────

export function calculateAllMetrics(
  input: CalcInput
): Record<string, number> {
  const { weight_kg, height_cm, age, sex, raw_impedance } = input;

  const bmi = calcBMI(weight_kg, height_cm);
  const body_fat_pct = calcBodyFatPct(weight_kg, height_cm, age, sex);
  const fat_weight_kg = calcFatWeightKg(weight_kg, body_fat_pct);
  const lbm_kg = calcLBM(weight_kg, body_fat_pct);
  const skeletal_muscle_pct = calcSkeletalMusclePct(weight_kg, height_cm, age, sex, raw_impedance);
  const skeletal_muscle_weight_kg = calcSkeletalMuscleKg(weight_kg, skeletal_muscle_pct);
  const muscle_weight_kg = calcMuscleWeightKg(lbm_kg);
  const muscle_rate_pct = calcMuscleRatePct(muscle_weight_kg, weight_kg);
  const water_pct = calcWaterPct(weight_kg, height_cm, age, sex);
  const water_weight_kg = calcWaterKg(weight_kg, water_pct);
  const visceral_fat = calcVisceralFat(weight_kg, height_cm, age, sex);
  const bone_weight_kg = calcBoneKg(lbm_kg);
  const bmr = calcBMR(weight_kg, height_cm, age, sex);
  const protein_pct = calcProteinPct(lbm_kg, weight_kg);
  const obesity_pct = calcObesityPct(weight_kg, height_cm);
  const metabolic_age = calcMetabolicAge(bmr, sex);

  return {
    weight_kg,
    bmi,
    body_fat_pct,
    fat_weight_kg,
    skeletal_muscle_pct,
    skeletal_muscle_weight_kg,
    muscle_rate_pct,
    muscle_weight_kg,
    water_pct,
    water_weight_kg,
    visceral_fat,
    bone_weight_kg,
    bmr,
    protein_pct,
    obesity_pct,
    metabolic_age,
    lbm_kg,
    real_age: age,
    height_cm,
  };
}

// ─── Classificações ──────────────────────────────────────────────────────────

function badge(
  classification: MetricClassification | null
): { label: MetricClassification | null; color: string | null } {
  if (!classification) return { label: null, color: null };
  const colorMap: Record<MetricClassification, string> = {
    Obeso: Colors.badgeObese,
    Grave: Colors.badgeObese,
    Saudável: Colors.badgeHealthy,
    Excelente: Colors.badgeHealthy,
    Alto: Colors.badgeLowHigh,
    Baixo: Colors.badgeLowHigh,
  };
  return { label: classification, color: colorMap[classification] };
}

export function classifyBMI(bmi: number): MetricResult {
  let c: MetricClassification;
  if (bmi < 18.5) c = 'Baixo';
  else if (bmi < 25) c = 'Saudável';
  else if (bmi < 30) c = 'Alto';
  else c = 'Obeso';
  return { value: bmi, classification: c, badgeColor: badge(c).color };
}

export function classifyBodyFatPct(pct: number, sex: 'male' | 'female'): MetricResult {
  let c: MetricClassification;
  if (sex === 'male') {
    if (pct < 6) c = 'Baixo';
    else if (pct < 18) c = 'Saudável';
    else if (pct < 25) c = 'Alto';
    else c = 'Obeso';
  } else {
    if (pct < 14) c = 'Baixo';
    else if (pct < 25) c = 'Saudável';
    else if (pct < 32) c = 'Alto';
    else c = 'Obeso';
  }
  return { value: pct, classification: c, badgeColor: badge(c).color };
}

export function classifySkeletalMusclePct(pct: number, sex: 'male' | 'female'): MetricResult {
  let c: MetricClassification;
  if (sex === 'male') {
    if (pct < 29) c = 'Baixo';
    else if (pct < 36) c = 'Saudável';
    else c = 'Excelente';
  } else {
    if (pct < 24) c = 'Baixo';
    else if (pct < 30) c = 'Saudável';
    else c = 'Excelente';
  }
  return { value: pct, classification: c, badgeColor: badge(c).color };
}

export function classifyMuscleRatePct(pct: number): MetricResult {
  let c: MetricClassification;
  if (pct < 50) c = 'Baixo';
  else if (pct < 60) c = 'Saudável';
  else c = 'Excelente';
  return { value: pct, classification: c, badgeColor: badge(c).color };
}

export function classifyWaterPct(pct: number, sex: 'male' | 'female'): MetricResult {
  let c: MetricClassification;
  if (sex === 'male') {
    if (pct < 50) c = 'Baixo';
    else if (pct <= 65) c = 'Saudável';
    else c = 'Alto';
  } else {
    if (pct < 45) c = 'Baixo';
    else if (pct <= 60) c = 'Saudável';
    else c = 'Alto';
  }
  return { value: pct, classification: c, badgeColor: badge(c).color };
}

export function classifyVisceralFat(vf: number): MetricResult {
  let c: MetricClassification;
  if (vf <= 9) c = 'Saudável';
  else if (vf <= 14) c = 'Alto';
  else c = 'Obeso';
  return { value: vf, classification: c, badgeColor: badge(c).color };
}

export function classifyBone(bone_kg: number, sex: 'male' | 'female'): MetricResult {
  let c: MetricClassification;
  if (sex === 'male') {
    c = bone_kg >= 3.0 ? 'Excelente' : 'Baixo';
  } else {
    c = bone_kg >= 2.0 ? 'Excelente' : 'Baixo';
  }
  return { value: bone_kg, classification: c, badgeColor: badge(c).color };
}

export function classifyBMR(bmr: number, sex: 'male' | 'female'): MetricResult {
  let c: MetricClassification;
  const threshold = sex === 'male' ? 1600 : 1300;
  c = bmr >= threshold ? 'Alto' : 'Baixo';
  return { value: bmr, classification: c, badgeColor: badge(c).color };
}

export function classifyProteinPct(pct: number): MetricResult {
  let c: MetricClassification;
  if (pct < 16) c = 'Baixo';
  else if (pct <= 20) c = 'Saudável';
  else c = 'Excelente';
  return { value: pct, classification: c, badgeColor: badge(c).color };
}

export function classifyObesityPct(pct: number): MetricResult {
  let c: MetricClassification;
  if (pct <= 0) c = 'Saudável';
  else if (pct <= 20) c = 'Alto';
  else if (pct <= 40) c = 'Obeso';
  else c = 'Grave';
  return { value: pct, classification: c, badgeColor: badge(c).color };
}

export function classifyWeight(
  weight_kg: number,
  height_cm: number
): MetricResult {
  const { underweight_max, healthy_max, overweight_max } = calcWeightThresholds(height_cm);
  let c: MetricClassification;
  if (weight_kg < underweight_max) c = 'Baixo';
  else if (weight_kg <= healthy_max) c = 'Saudável';
  else if (weight_kg <= overweight_max) c = 'Alto';
  else c = 'Obeso';
  return { value: weight_kg, classification: c, badgeColor: badge(c).color };
}

// ─── Todas as 19 métricas classificadas ─────────────────────────────────────

export interface ClassifiedMetrics {
  weight: MetricResult;
  bmi: MetricResult;
  bodyFatPct: MetricResult;
  fatWeightKg: MetricResult;
  skeletalMusclePct: MetricResult;
  skeletalMuscleKg: MetricResult;
  muscleRatePct: MetricResult;
  muscleWeightKg: MetricResult;
  waterPct: MetricResult;
  waterWeightKg: MetricResult;
  visceralFat: MetricResult;
  boneKg: MetricResult;
  bmr: MetricResult;
  proteinPct: MetricResult;
  obesityPct: MetricResult;
  metabolicAge: MetricResult;
  lbmKg: MetricResult;
  realAge: MetricResult;
  heightCm: MetricResult;
}

export function classifyAllMetrics(
  m: {
    weight_kg: number; height_cm: number; bmi: number;
    body_fat_pct: number; fat_weight_kg: number;
    skeletal_muscle_pct: number; skeletal_muscle_weight_kg: number;
    muscle_rate_pct: number; muscle_weight_kg: number;
    water_pct: number; water_weight_kg: number;
    visceral_fat: number; bone_weight_kg: number; bmr: number;
    protein_pct: number; obesity_pct: number;
    metabolic_age: number; lbm_kg: number;
    real_age: number;
  },
  sex: 'male' | 'female'
): ClassifiedMetrics {
  return {
    weight: classifyWeight(m.weight_kg, m.height_cm),
    bmi: classifyBMI(m.bmi),
    bodyFatPct: classifyBodyFatPct(m.body_fat_pct, sex),
    fatWeightKg: { value: m.fat_weight_kg, classification: classifyBodyFatPct(m.body_fat_pct, sex).classification, badgeColor: classifyBodyFatPct(m.body_fat_pct, sex).badgeColor },
    skeletalMusclePct: classifySkeletalMusclePct(m.skeletal_muscle_pct, sex),
    skeletalMuscleKg: { value: m.skeletal_muscle_weight_kg, classification: classifySkeletalMusclePct(m.skeletal_muscle_pct, sex).classification, badgeColor: classifySkeletalMusclePct(m.skeletal_muscle_pct, sex).badgeColor },
    muscleRatePct: classifyMuscleRatePct(m.muscle_rate_pct),
    muscleWeightKg: { value: m.muscle_weight_kg, classification: classifyMuscleRatePct(m.muscle_rate_pct).classification, badgeColor: classifyMuscleRatePct(m.muscle_rate_pct).badgeColor },
    waterPct: classifyWaterPct(m.water_pct, sex),
    waterWeightKg: { value: m.water_weight_kg, classification: classifyWaterPct(m.water_pct, sex).classification, badgeColor: classifyWaterPct(m.water_pct, sex).badgeColor },
    visceralFat: classifyVisceralFat(m.visceral_fat),
    boneKg: classifyBone(m.bone_weight_kg, sex),
    bmr: classifyBMR(m.bmr, sex),
    proteinPct: classifyProteinPct(m.protein_pct),
    obesityPct: classifyObesityPct(m.obesity_pct),
    metabolicAge: { value: m.metabolic_age, classification: null, badgeColor: null },
    lbmKg: { value: m.lbm_kg, classification: null, badgeColor: null },
    realAge: { value: m.real_age, classification: null, badgeColor: null },
    heightCm: { value: m.height_cm, classification: null, badgeColor: null },
  };
}

// ─── Meta de água diária ─────────────────────────────────────────────────────

/** Meta de água em mL baseada no peso (35ml/kg) */
export function calcWaterGoalMl(weight_kg: number): number {
  return Math.round(weight_kg * 35);
}

/** Meta de calorias TDEE baseada no BMR e nível de atividade */
export function calcTDEE(bmr: number, activity_level: number): number {
  const factors = [1.2, 1.375, 1.55, 1.725, 1.9];
  const factor = factors[Math.min(activity_level - 1, 4)] ?? 1.55;
  return Math.round(bmr * factor);
}
