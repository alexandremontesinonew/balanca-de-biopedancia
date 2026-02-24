import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, SafeAreaView, StatusBar,
  Animated, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BLEScanner, BLEDevice, BLEMeasurement, BLEState } from '@/src/lib/ble';
import { calculateAllMetrics } from '@/src/lib/calculations';
import { useAppStore } from '@/src/store';
import { Colors, Spacing, FontSize } from '@/src/constants/theme';

const STATE_LABELS: Record<BLEState, string> = {
  IDLE: 'Pronto para escanear',
  SCANNING: 'Escaneando dispositivos...',
  CONNECTING: 'Conectando...',
  DISCOVERING: 'Descobrindo serviços...',
  SUBSCRIBING: 'Configurando notificações...',
  READING: 'Aguardando medição...',
  DONE: 'Medição concluída!',
  ERROR: 'Erro na conexão',
};

export default function BLEScanScreen() {
  const router = useRouter();
  const { user, addMeasurement, addDevice } = useAppStore();
  const [bleState, setBleState] = useState<BLEState>('IDLE');
  const [devices, setDevices] = useState<BLEDevice[]>([]);
  const [measurement, setMeasurement] = useState<BLEMeasurement | null>(null);
  const [saving, setSaving] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scannerRef = useRef<BLEScanner | null>(null);

  const isMockMode = Platform.OS === 'web';

  useEffect(() => {
    const scanner = new BLEScanner({
      onStateChange: setBleState,
      onDeviceFound: (d) => setDevices((prev) => {
        const exists = prev.find((p) => p.id === d.id);
        return exists ? prev : [...prev, d];
      }),
      onMeasurement: handleMeasurement,
      mockMode: isMockMode,
    });
    scannerRef.current = scanner;
    return () => { scanner.disconnect(); };
  }, []);

  useEffect(() => {
    if (bleState === 'SCANNING' || bleState === 'READING') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [bleState]);

  const handleMeasurement = (m: BLEMeasurement) => {
    setMeasurement(m);
  };

  const handleScan = () => {
    setDevices([]);
    setMeasurement(null);
    scannerRef.current?.startScan();
  };

  const handleConnect = async (device: BLEDevice) => {
    await scannerRef.current?.connectAndRead(device.id, device.name);
    // Salva dispositivo se ainda não existe
    await addDevice({ user_id: 1, name: device.name, mac: device.id });
  };

  const handleSave = async () => {
    if (!measurement) return;
    setSaving(true);
    try {
      const u = user ?? { height_cm: 180, age: 43, sex: 'male' as const, activity_level: 3 };
      const metrics = calculateAllMetrics({
        weight_kg: measurement.weight_kg,
        height_cm: u.height_cm,
        age: u.age,
        sex: u.sex as 'male' | 'female',
        raw_impedance: measurement.impedance,
      });

      await addMeasurement({
        user_id: 1,
        datetime: new Date().toISOString().replace('T', 'T').slice(0, 19),
        ...metrics as any,
      });

      router.replace('/details');
    } finally {
      setSaving(false);
    }
  };

  const isActive = bleState === 'SCANNING' || bleState === 'READING' ||
    bleState === 'CONNECTING' || bleState === 'DISCOVERING' || bleState === 'SUBSCRIBING';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.textPrimary} />
          <Text style={styles.headerTitle}>Conectar Balança</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.btIconArea}>
        <Animated.View style={[styles.btPulse, { transform: [{ scale: pulseAnim }] }]} />
        <View style={styles.btIcon}>
          <MaterialCommunityIcons
            name="bluetooth"
            size={48}
            color={isActive ? Colors.primary : Colors.textDisabled}
          />
        </View>
      </View>

      <Text style={styles.stateLabel}>{STATE_LABELS[bleState]}</Text>
      {isMockMode && (
        <Text style={styles.mockLabel}>Modo Demo (sem hardware)</Text>
      )}

      {/* Resultado da medição */}
      {measurement && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Medição detectada</Text>
          <Text style={styles.resultWeight}>{measurement.weight_kg.toFixed(2)} Kg</Text>
          {measurement.impedance && (
            <Text style={styles.resultImpedance}>Impedância: {measurement.impedance} Ω</Text>
          )}
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>{saving ? 'Salvando...' : 'Salvar medição'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Lista de dispositivos encontrados */}
      {devices.length > 0 && !measurement && (
        <View style={styles.devicesSection}>
          <Text style={styles.devicesTitle}>Dispositivos encontrados</Text>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.deviceItem}
                onPress={() => handleConnect(item)}
              >
                <MaterialCommunityIcons name="scale-bathroom" size={24} color={Colors.primary} />
                <View style={styles.deviceItemInfo}>
                  <Text style={styles.deviceItemName}>{item.name}</Text>
                  <Text style={styles.deviceItemId}>{item.id}</Text>
                </View>
                <Text style={styles.deviceRssi}>{item.rssi} dBm</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <View style={styles.bottomBtn}>
        {bleState === 'IDLE' || bleState === 'DONE' || bleState === 'ERROR' ? (
          <TouchableOpacity style={styles.scanBtn} onPress={handleScan}>
            <MaterialCommunityIcons name="bluetooth-connect" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.scanBtnText}>
              {bleState === 'DONE' ? 'Escanear novamente' : 'Iniciar escaneamento'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.scanBtn, styles.stopBtn]}
            onPress={() => scannerRef.current?.stopScan()}
          >
            <Text style={styles.scanBtnText}>Parar</Text>
          </TouchableOpacity>
        )}
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
  btIconArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    height: 120,
  },
  btPulse: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '22',
  },
  btIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary + '18',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stateLabel: {
    textAlign: 'center',
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 16,
  },
  mockLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  resultCard: {
    margin: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  resultTitle: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  resultWeight: { fontSize: 36, fontWeight: 'bold', color: Colors.textPrimary },
  resultImpedance: { fontSize: 13, color: Colors.textSecondary },
  saveBtn: {
    backgroundColor: Colors.gradientPrimaryStart,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  devicesSection: { margin: Spacing.md },
  devicesTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: 8,
  },
  deviceItemInfo: { flex: 1, marginLeft: 12 },
  deviceItemName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  deviceItemId: { fontSize: 11, color: Colors.textSecondary },
  deviceRssi: { fontSize: 12, color: Colors.textSecondary },
  bottomBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    paddingBottom: 28,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  scanBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  stopBtn: { backgroundColor: '#F44336' },
  scanBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
});
