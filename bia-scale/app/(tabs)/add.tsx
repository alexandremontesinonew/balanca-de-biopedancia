import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Colors, FontSize, Spacing } from "@/src/constants/theme";

export default function AddScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <Text style={styles.text}>Adicionar — Em construção</Text>
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
  text: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
