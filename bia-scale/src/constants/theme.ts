// BIA Scale App — Tema Global
// Baseado na especificação v3

export const Colors = {
  // Fundos
  background: '#FFFFFF',
  backgroundAlt: '#F8F9FA',

  // Cards gradient (azul claro)
  cardGradientStart: '#E8F0FE',
  cardGradientEnd: '#F0F4FF',

  // Barra de peso
  barUnderweight: '#4A90D9',
  barHealthy: '#4CAF50',
  barOverweight: '#FFC107',
  barObese: '#F44336',

  // Badges
  badgeObese: '#F44336',
  badgeObeseText: '#F44336',
  badgeHealthy: '#4CAF50',
  badgeHealthyText: '#4CAF50',
  badgeLowHigh: '#00BCD4',
  badgeLowHighText: '#00BCD4',

  // Botões primários gradient
  gradientPrimaryStart: '#5B7FFF',
  gradientPrimaryEnd: '#8B5CF6',

  // Botão gradient água
  gradientWaterStart: '#00BCD4',
  gradientWaterEnd: '#26C6DA',

  // Botão outline
  outlineBorder: '#333333',

  // FAB central
  fab: '#2196F3',

  // Tab bar
  tabActive: '#2196F3',
  tabInactive: '#999999',

  // Header Config gradient
  headerConfigStart: '#FF9A9E',
  headerConfigMid: '#FECFEF',
  headerConfigEnd: '#FFFFFF',

  // Tooltip
  tooltip: '#333333',
  tooltipText: '#FFFFFF',

  // Água
  water: '#00BCD4',
  waterLight: '#E0F7FA',

  // Textos
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textDisabled: '#CCCCCC',

  // Azul principal
  primary: '#2196F3',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 100,
} as const;

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
} as const;
