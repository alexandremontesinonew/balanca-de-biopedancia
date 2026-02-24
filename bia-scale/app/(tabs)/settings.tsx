import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Colors, FontSize, Spacing } from "@/src/constants/theme";

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Em construção</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
});
