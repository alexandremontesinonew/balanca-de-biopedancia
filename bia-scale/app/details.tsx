import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store';
import { classifyAllMetrics, calcWeightThresholds } from '@/src/lib/calculations';
import { WeightBar } from '@/src/components/WeightBar';
import { MetricBadge } from '@/src/components/MetricBadge';
import { Colors, Spacing, FontSize } from '@/src/constants/theme';
import type { MetricClassification } from '@/src/types';

interface MetricRow {
  icon: string;
  name: string;
  value: number;
  unit: string;
  decimals: number;
  classification: MetricClassification | null;
  badgeColor: string | null;
}

export default function DetailsScreen() {
  const router = useRouter();
  const { latestMeasurement, measurements, loadMeasurements, user } = useAppStore();

  useEffect(() => {
    loadMeasurements();
  }, []);

  if (!latestMeasurement) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: Colors.textSecondary, margin: 20 }}>
          Nenhuma medição encontrada.
        </Text>
      </SafeAreaView>
    );
  }

  const m = latestMeasurement;
  const sex = (user?.sex ?? 'male') as 'male' | 'female';
  const classified = classifyAllMetrics(m, sex);

  // Delta com medição anterior
  const prev = measurements[1];
  const delta = prev ? +(m.weight_kg - prev.weight_kg).toFixed(1) : null;
  const prevDate = prev
    ? prev.datetime.split('T')[0].replace(/-/g, '/')
    : null;

  function r(icon: string, name: string, val: number, unit: string, decimals: number, c: { classification: MetricClassification | null; badgeColor: string | null }): MetricRow {
    return { icon, name, value: val, unit, decimals, classification: c.classification, badgeColor: c.badgeColor };
  }

  const rows: MetricRow[] = [
    r('scale', 'Peso(Kg)', m.weight_kg, 'Kg', 2, classified.weight),
    r('emoticon-poop', 'IMC', m.bmi, '', 1, classified.bmi),
    r('chart-line-variant', 'Gordura(%)', m.body_fat_pct, '%', 1, classified.bodyFatPct),
    r('chart-line', 'Peso da gordura(Kg)', m.fat_weight_kg, 'Kg', 1, classified.fatWeightKg),
    r('arm-flex', 'Percentual da massa muscular esquel.(%)', m.skeletal_muscle_pct, '%', 1, classified.skeletalMusclePct),
    r('arm-flex-outline', 'Peso da massa muscular esquel.(Kg)', m.skeletal_muscle_weight_kg, 'Kg', 1, classified.skeletalMuscleKg),
    r('pulse', 'Registro de massa muscular(%)', m.muscle_rate_pct, '%', 1, classified.muscleRatePct),
    r('weight-lifter', 'Peso da massa muscular(Kg)', m.muscle_weight_kg, 'Kg', 1, classified.muscleWeightKg),
    r('water', '\u00c1gua(%)', m.water_pct, '%', 1, classified.waterPct),
    r('waves', 'Peso da \u00e1gua(Kg)', m.water_weight_kg, 'Kg', 1, classified.waterWeightKg),
    r('human-male', 'Gordura visceral', m.visceral_fat, '', 1, classified.visceralFat),
    r('bone', 'Ossos(Kg)', m.bone_weight_kg, 'Kg', 1, classified.boneKg),
    r('fire-circle', 'Metabolismo', m.bmr, 'kcal', 1, classified.bmr),
    r('target', 'Prote\u00edna(%)', m.protein_pct, '%', 1, classified.proteinPct),
    r('speedometer', 'Obesidade(%)', m.obesity_pct, '%', 1, classified.obesityPct),
    r('account-group', 'Idade metab\u00f3lica', m.metabolic_age, '', 1, classified.metabolicAge),
    r('weight-kilogram', 'LBM(Kg)', m.lbm_kg, 'Kg', 2, classified.lbmKg),
    r('sprout', 'Idade real', m.real_age, '', 0, classified.realAge),
    r('ruler', 'Altura(cm)', m.height_cm, 'cm', 0, classified.heightCm),
  ];

  const weightClass = classified.weight.classification;
  const weightBadgeLabel = weightClass ?? 'Saudável';
  const weightBadgeColor = classified.weight.badgeColor ?? Colors.badgeHealthy;

  const datetimeDisplay = m.datetime.replace('T', ' ');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.textPrimary} />
          <Text style={styles.headerTitle}>Detalhes</Text>
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="content-save-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="eye-circle-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="refresh" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Card de peso */}
        <View style={styles.weightCard}>
          {/* Badge classificação + foto */}
          <View style={styles.cardTopRow}>
            <View style={[styles.weightBadge, { borderColor: weightBadgeColor }]}>
              <Text style={[styles.weightBadgeText, { color: weightBadgeColor }]}>
                {weightBadgeLabel} 😐
              </Text>
            </View>
            <TouchableOpacity style={styles.photoBtn}>
              <MaterialCommunityIcons name="image-plus" size={22} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Peso e data */}
          <Text style={styles.weightValue}>{m.weight_kg.toFixed(2)} Kg</Text>
          <Text style={styles.weightDate}>{datetimeDisplay}</Text>

          {/* Barra */}
          <View style={{ marginVertical: 12 }}>
            <WeightBar weight_kg={m.weight_kg} height_cm={m.height_cm} showThresholds />
          </View>

          {/* Botão editar */}
          <TouchableOpacity style={styles.editBtn}>
            <MaterialCommunityIcons name="pencil" size={18} color={Colors.primary} />
          </TouchableOpacity>

          {/* Delta */}
          <View style={styles.deltaRow}>
            <View style={styles.deltaLeft}>
              <MaterialCommunityIcons name="timer-outline" size={16} color="#999" />
              <View style={{ marginLeft: 6 }}>
                <Text style={styles.deltaLabel}>Comparado com a última vez</Text>
                {prevDate && (
                  <Text style={styles.deltaDate}>({prevDate})</Text>
                )}
              </View>
            </View>
            <Text style={[styles.deltaValue, delta !== null && delta < 0 ? styles.deltaGood : styles.deltaBad]}>
              {delta !== null ? (delta > 0 ? `+${delta}` : `${delta}`) : '- -'}
            </Text>
          </View>

          <View style={styles.bestRow}>
            <View style={styles.deltaLeft}>
              <MaterialCommunityIcons name="fire" size={16} color="#FF9800" />
              <Text style={[styles.deltaLabel, { marginLeft: 6 }]}>Melhor peso de 30 dias</Text>
            </View>
            <Text style={styles.deltaValue}>- -</Text>
          </View>
        </View>

        {/* Lista de 19 métricas */}
        {rows.map((row, index) => (
          <View
            key={row.name}
            style={[
              styles.metricRow,
              { backgroundColor: index % 2 === 0 ? Colors.background : Colors.backgroundAlt },
            ]}
          >
            <View style={styles.metricLeft}>
              <MaterialCommunityIcons name={row.icon as any} size={24} color={Colors.primary} />
              <Text style={styles.metricName} numberOfLines={2}>{row.name}</Text>
            </View>
            <View style={styles.metricRight}>
              <Text style={styles.metricValue}>
                {row.decimals === 0
                  ? Math.round(row.value)
                  : row.value.toFixed(row.decimals)}
                {row.unit ? ` ${row.unit}` : ''}
              </Text>
              {row.classification && row.badgeColor && (
                <MetricBadge label={row.classification} color={row.badgeColor} />
              )}
            </View>
          </View>
        ))}

        {/* Botão configurações */}
        <View style={styles.configBtnWrapper}>
          <TouchableOpacity
            style={styles.configBtn}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Text style={styles.configBtnText}>Ir para configurações</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  headerIcons: { flexDirection: 'row' },
  iconBtn: { marginLeft: Spacing.sm },
  weightCard: {
    margin: Spacing.md,
    padding: Spacing.md,
    borderRadius: 16,
    backgroundColor: Colors.cardGradientStart,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  weightBadge: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  weightBadgeText: { fontSize: 12, fontWeight: '600' },
  photoBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weightValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  weightDate: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    alignSelf: 'flex-end',
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#E3EEFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  deltaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E0E8F8',
  },
  bestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  deltaLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1 },
  deltaLabel: { fontSize: 12, color: Colors.textSecondary },
  deltaDate: { fontSize: 11, color: Colors.textDisabled },
  deltaValue: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  deltaGood: { color: '#4CAF50' },
  deltaBad: { color: '#F44336' },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEEEEE',
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  metricName: {
    fontSize: 13,
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  metricRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  metricValue: {
    fontSize: FontSize.xl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  configBtnWrapper: {
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.md,
  },
  configBtn: {
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 100,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  configBtnText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});
