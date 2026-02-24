import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/src/constants/theme';

interface Props {
  weight_kg: number;
  height_cm: number;
  showThresholds?: boolean;
}

export function WeightBar({ weight_kg, height_cm, showThresholds = true }: Props) {
  const h = height_cm / 100;
  const underMax = +(18.5 * h * h).toFixed(2);
  const healthyMax = +(24.9 * h * h).toFixed(2);
  const overMax = +(29.9 * h * h).toFixed(2);

  // Position indicator (0-100%)
  const maxDisplayWeight = overMax * 1.5;
  const pct = Math.min(1, Math.max(0, weight_kg / maxDisplayWeight));
  const indicatorLeft = `${pct * 100}%` as const;

  const sections = [
    { flex: underMax, color: Colors.barUnderweight },
    { flex: healthyMax - underMax, color: Colors.barHealthy },
    { flex: overMax - healthyMax, color: Colors.barOverweight },
    { flex: maxDisplayWeight - overMax, color: Colors.barObese },
  ];

  return (
    <View style={styles.container}>
      {showThresholds && (
        <View style={styles.thresholds}>
          <Text style={styles.threshold}>{underMax.toFixed(2)}</Text>
          <Text style={styles.threshold}>{healthyMax.toFixed(2)}</Text>
          <Text style={styles.threshold}>{overMax.toFixed(2)}</Text>
        </View>
      )}
      <View style={styles.barWrapper}>
        <View style={styles.bar}>
          {sections.map((s, i) => (
            <View key={i} style={[styles.section, { flex: s.flex, backgroundColor: s.color }]} />
          ))}
        </View>
        <View style={[styles.indicator, { left: indicatorLeft }]}>
          <Text style={styles.indicatorEmoji}>😐</Text>
        </View>
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>Baixo</Text>
        <Text style={styles.label}>Saudável</Text>
        <Text style={styles.label}>Alto</Text>
        <Text style={styles.label}>Obeso</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  thresholds: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 2,
  },
  threshold: {
    fontSize: 10,
    color: '#666',
  },
  barWrapper: {
    position: 'relative',
    height: 20,
  },
  bar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 3,
  },
  section: { height: 14 },
  indicator: {
    position: 'absolute',
    top: -4,
    marginLeft: -10,
  },
  indicatorEmoji: { fontSize: 18 },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  label: { fontSize: 10, color: '#666' },
});
