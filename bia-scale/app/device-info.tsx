import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store';
import { Colors, Spacing, FontSize } from '@/src/constants/theme';
import type { Device } from '@/src/types';

export default function DeviceInfoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { devices, loadDevices, removeDevice } = useAppStore();
  const [device, setDevice] = useState<Device | null>(null);

  useEffect(() => {
    loadDevices();
  }, []);

  useEffect(() => {
    if (id && devices.length > 0) {
      setDevice(devices.find((d) => d.id === Number(id)) ?? null);
    }
  }, [devices, id]);

  const handleUnpair = () => {
    Alert.alert(
      'Desparear dispositivo',
      `Deseja remover "${device?.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            if (device) {
              await removeDevice(device.id);
              router.back();
            }
          },
        },
      ]
    );
  };

  const rows = device
    ? [
        { label: 'Nome', value: device.name, editable: true },
        { label: 'MAC', value: device.mac, editable: false },
        { label: 'Fábrica', value: device.manufacturer || '/', editable: false },
        { label: 'Telefone número', value: device.phone || '/', editable: false },
        { label: 'Endereço', value: device.address || '/', editable: false },
      ]
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.textPrimary} />
          <Text style={styles.headerTitle}>Informação da balança</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {rows.map((row, i) => (
          <View
            key={i}
            style={[styles.row, i < rows.length - 1 && styles.rowBorder]}
          >
            <Text style={styles.rowLabel}>{row.label}</Text>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{row.value}</Text>
              {row.editable && (
                <MaterialCommunityIcons name="chevron-right" size={18} color={Colors.textSecondary} />
              )}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.bottomBtn}>
        <TouchableOpacity style={styles.unpairBtn} onPress={handleUnpair}>
          <Text style={styles.unpairBtnText}>Não par</Text>
        </TouchableOpacity>
      </View>
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
  list: {
    margin: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  rowLabel: { fontSize: FontSize.md, color: Colors.textSecondary },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowValue: { fontSize: FontSize.md, color: Colors.textPrimary },
  bottomBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  unpairBtn: {
    backgroundColor: Colors.gradientPrimaryStart,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
  },
  unpairBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
});
