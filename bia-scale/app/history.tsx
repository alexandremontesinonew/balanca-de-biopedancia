import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store';
import { Colors, Spacing, FontSize } from '@/src/constants/theme';
import type { Measurement } from '@/src/types';

const { width } = Dimensions.get('window');

type Period = '7d' | '30d' | '90d' | 'all';
type MetricKey = 'weight_kg' | 'body_fat_pct' | 'bmi' | 'water_pct' | 'muscle_weight_kg' | 'visceral_fat' | 'bmr';

const METRICS: { key: MetricKey; label: string; unit: string }[] = [
  { key: 'weight_kg', label: 'Peso', unit: 'Kg' },
  { key: 'body_fat_pct', label: 'Gordura%', unit: '%' },
  { key: 'bmi', label: 'IMC', unit: '' },
  { key: 'water_pct', label: 'Água%', unit: '%' },
  { key: 'muscle_weight_kg', label: 'Massa Muscular', unit: 'Kg' },
  { key: 'visceral_fat', label: 'Gordura Visceral', unit: '' },
  { key: 'bmr', label: 'BMR', unit: 'kcal' },
];

function SimpleLineChart({
  data,
  color,
}: {
  data: { x: string; y: number }[];
  color: string;
}) {
  if (data.length < 2) {
    return (
      <View style={chartStyles.empty}>
        <Text style={{ color: Colors.textSecondary, fontSize: 13 }}>Dados insuficientes</Text>
      </View>
    );
  }

  const values = data.map((d) => d.y);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const chartH = 120;
  const chartW = width - 48;
  const step = chartW / (data.length - 1);

  const points = data.map((d, i) => ({
    x: i * step,
    y: chartH - ((d.y - minVal) / range) * (chartH - 20) - 10,
    label: d.x,
    value: d.y,
  }));

  return (
    <View style={[chartStyles.wrapper, { height: chartH + 30 }]}>
      {/* Y-axis labels */}
      <View style={chartStyles.yLabels}>
        <Text style={chartStyles.yLabel}>{maxVal.toFixed(1)}</Text>
        <Text style={chartStyles.yLabel}>{minVal.toFixed(1)}</Text>
      </View>

      {/* Simple dots and lines */}
      <View style={{ flex: 1 }}>
        {points.map((p, i) => (
          <React.Fragment key={i}>
            {/* Dot */}
            <View
              style={[
                chartStyles.dot,
                { left: p.x - 5, top: p.y - 5, backgroundColor: color },
              ]}
            />
            {/* Label */}
            <Text
              style={[chartStyles.xLabel, { left: p.x - 20, top: chartH + 2 }]}
              numberOfLines={1}
            >
              {p.label}
            </Text>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  wrapper: { position: 'relative', marginVertical: 8 },
  empty: { height: 120, justifyContent: 'center', alignItems: 'center' },
  yLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 30,
    justifyContent: 'space-between',
    width: 40,
  },
  yLabel: { fontSize: 10, color: Colors.textSecondary },
  dot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  xLabel: {
    position: 'absolute',
    fontSize: 9,
    color: Colors.textSecondary,
    width: 40,
    textAlign: 'center',
  },
});

export default function HistoryScreen() {
  const router = useRouter();
  const { measurements, loadMeasurements } = useAppStore();
  const [period, setPeriod] = useState<Period>('30d');
  const [metric, setMetric] = useState<MetricKey>('weight_kg');

  useEffect(() => {
    loadMeasurements();
  }, []);

  const now = new Date();
  const filtered = measurements.filter((m) => {
    const d = new Date(m.datetime);
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    if (period === '7d') return diffDays <= 7;
    if (period === '30d') return diffDays <= 30;
    if (period === '90d') return diffDays <= 90;
    return true;
  });

  const chartData = [...filtered]
    .reverse()
    .map((m) => ({
      x: m.datetime.split('T')[0].slice(5), // MM-DD
      y: m[metric] as number,
    }));

  const selectedMetricDef = METRICS.find((m) => m.key === metric)!;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.textPrimary} />
          <Text style={styles.headerTitle}>Histórico</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Filtros de período */}
        <View style={styles.periods}>
          {(['7d', '30d', '90d', 'all'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodText, period === p && styles.periodTextActive]}>
                {p === 'all' ? 'Todos' : p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Seletor de métrica */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.metricsScroll}
        >
          {METRICS.map((m) => (
            <TouchableOpacity
              key={m.key}
              style={[styles.metricChip, metric === m.key && styles.metricChipActive]}
              onPress={() => setMetric(m.key)}
            >
              <Text style={[styles.metricChipText, metric === m.key && styles.metricChipTextActive]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Gráfico */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {selectedMetricDef.label}
            {selectedMetricDef.unit ? ` (${selectedMetricDef.unit})` : ''}
          </Text>
          <SimpleLineChart data={chartData} color={Colors.primary} />
        </View>

        {/* Lista cronológica */}
        <View style={{ marginHorizontal: Spacing.md }}>
          {filtered.map((m, i) => {
            const prev = filtered[i + 1];
            const val = m[metric] as number;
            const prevVal = prev ? (prev[metric] as number) : null;
            const delta = prevVal !== null ? +(val - prevVal).toFixed(1) : null;
            return (
              <TouchableOpacity
                key={m.id}
                style={styles.historyItem}
                onPress={() => router.push('/details')}
              >
                <View>
                  <Text style={styles.historyDate}>{m.datetime.replace('T', ' ')}</Text>
                  <Text style={styles.historyValue}>
                    {val.toFixed(1)} {selectedMetricDef.unit}
                  </Text>
                </View>
                {delta !== null && (
                  <Text style={[styles.historyDelta, delta < 0 ? styles.deltaGood : styles.deltaBad]}>
                    {delta > 0 ? '+' : ''}{delta}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
          {filtered.length === 0 && (
            <Text style={{ color: Colors.textSecondary, textAlign: 'center', margin: 20 }}>
              Sem dados para o período selecionado.
            </Text>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textPrimary },
  periods: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: 8,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  periodBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  periodText: { fontSize: 13, color: Colors.textSecondary },
  periodTextActive: { color: '#fff', fontWeight: '600' },
  metricsScroll: { paddingHorizontal: Spacing.md, gap: 8, paddingBottom: 8 },
  metricChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: Colors.backgroundAlt,
  },
  metricChipActive: { backgroundColor: Colors.primary },
  metricChipText: { fontSize: 12, color: Colors.textSecondary },
  metricChipTextActive: { color: '#fff', fontWeight: '600' },
  chartCard: {
    margin: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 16,
  },
  chartTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  historyDate: { fontSize: 12, color: Colors.textSecondary },
  historyValue: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textPrimary },
  historyDelta: { fontSize: FontSize.lg, fontWeight: 'bold' },
  deltaGood: { color: '#4CAF50' },
  deltaBad: { color: '#F44336' },
});
