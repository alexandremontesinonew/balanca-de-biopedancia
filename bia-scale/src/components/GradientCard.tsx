import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/src/constants/theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

// Simula gradient com View estático (sem expo-linear-gradient para manter deps mínimas)
export function GradientCard({ children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardGradientStart,
    borderRadius: 16,
    padding: 16,
  },
});
