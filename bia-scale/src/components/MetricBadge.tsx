import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { MetricClassification } from '@/src/types';

interface Props {
  label: MetricClassification;
  color: string;
}

export function MetricBadge({ label, color }: Props) {
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
