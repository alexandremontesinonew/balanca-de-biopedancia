import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store';
import { classifyWeight, calcTDEE } from '@/src/lib/calculations';
import { WeightBar } from '@/src/components/WeightBar';
import { GradientCard } from '@/src/components/GradientCard';
import { AddBottomSheet } from '@/src/components/BottomSheet';
import { Colors, Spacing, FontSize } from '@/src/constants/theme';

export default function HomeScreen() {
  const router = useRouter();
  const {
    user, latestMeasurement, measurements, devices,
    todayWaterMl, waterGoalMl,
    loadMeasurements, loadUser, loadDevices, loadWaterIntakes,
  } = useAppStore();
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    loadUser();
    loadMeasurements();
    loadDevices();
    const today = new Date().toISOString().split('T')[0];
    loadWaterIntakes(today);
  }, []);

  const m = latestMeasurement;
  const prev = measurements[1];
  const delta = m && prev ? +(m.weight_kg - prev.weight_kg).toFixed(1) : null;
  const device = devices[0];
  const weightClass = m ? classifyWeight(m.weight_kg, m.height_cm) : null;
  const calorieGoal = m && user ? calcTDEE(m.bmr, user.activity_level) : 2073;
  const waterPct = waterGoalMl > 0 ? Math.round(todayWaterMl / waterGoalMl * 100) : 0;
  const waterRemaining = waterGoalMl - todayWaterMl;
  const deltaSign = delta !== null && delta > 0 ? '+' : '';
  const deltaStr = delta !== null ? deltaSign + String(delta) : '- -';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={24} color="#fff" />
          </View>
          <Text style={styles.userName}>{user?.name ?? 'xmontesino'}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => loadMeasurements()}>
            <MaterialCommunityIcons name="refresh" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <GradientCard style={styles.mainCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.deviceName}>{device?.name ?? 'Balan\u00e7a Bluetooth1'}</Text>
            <TouchableOpacity style={styles.historyBtn} onPress={() => router.push('/history')}>
              <Text style={styles.historyBtnText}>Hist\u00f3ria</Text>
            </TouchableOpacity>
          </View>
          {m ? (
            <>
              <Text style={styles.cardDate}>{m.datetime.replace('T', ' ')}</Text>
              <View style={styles.weightRow}>
                <MaterialCommunityIcons name="eye-outline" size={20} color={Colors.primary} />
                <Text style={styles.weightText}>{m.weight_kg.toFixed(2)} Kg</Text>
              </View>
              <View style={styles.barRow}>
                <View style={{ flex: 1 }}>
                  <WeightBar weight_kg={m.weight_kg} height_cm={m.height_cm} showThresholds={false} />
                </View>
                {weightClass?.classification && (
                  <View style={[styles.weightClassBadge, { borderColor: weightClass.badgeColor ?? '#F44336' }]}>
                    <Text style={[styles.weightClassText, { color: weightClass.badgeColor ?? '#F44336' }]}>
                      {weightClass.classification}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.deltaRow}>
                <View>
                  <Text style={styles.deltaValue}>{deltaStr}</Text>
                  <Text style={styles.deltaLabel}>Comparado c/ ultima vez</Text>
                </View>
                <View>
                  <Text style={styles.deltaValue}>- -</Text>
                  <Text style={styles.deltaLabel}>Melhor em 30 dias</Text>
                </View>
              </View>
            </>
          ) : (
            <Text style={styles.cardDate}>Sem medi\u00e7\u00f5es</Text>
          )}
        </GradientCard>

        <TouchableOpacity style={styles.startWeighBtn} onPress={() => setSheetVisible(true)}>
          <Text style={styles.startWeighText}>Comece a pesar</Text>
        </TouchableOpacity>

        <GradientCard>
          <Text style={styles.cardTitle}>Jejum</Text>
          <Text style={styles.cardSubtitle}>Bem-vindo/a Comece o seu plano de jejum!</Text>
        </GradientCard>

        <TouchableOpacity style={styles.trendCard} onPress={() => router.push('/history')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.trendIcon}>
              <MaterialCommunityIcons name="trending-up" size={22} color={Colors.primary} />
            </View>
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.cardTitle}>PesoTend\u00eancia</Text>
              <Text style={[styles.deltaValue, { color: delta !== null && delta < 0 ? '#4CAF50' : '#F44336' }]}>
                {delta !== null ? deltaSign + String(delta) + ' Kg' : '- -'}
              </Text>
              <Text style={styles.cardSubtitle}>Mudan\u00e7as recentes</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.trendCard} onPress={() => router.push('/water')}>
          <Text style={styles.cardTitle}>Beber \u00e1gua</Text>
          {todayWaterMl > 0 ? (
            <>
              <Text style={[styles.deltaValue, { color: Colors.water, fontSize: 24 }]}>{todayWaterMl}ml</Text>
              <Text style={styles.cardSubtitle}>{waterPct}% Restante {waterRemaining}ml</Text>
            </>
          ) : (
            <Text style={styles.cardSubtitle}>Bem-vindo/a a usar a fun\u00e7\u00e3o de beber \u00e1gua</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.trendCard}>
          <Text style={styles.cardTitle}>Registro de calorias</Text>
          <Text style={[styles.deltaValue, { fontSize: 22 }]}>0 Cal</Text>
          <Text style={styles.cardSubtitle}>Alvo {calorieGoal}Cal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.trendCard}>
          <Text style={styles.cardTitle}>Cintura</Text>
          <Text style={styles.cardSubtitle}>Sem dados</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      <AddBottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  userName: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textPrimary },
  headerRight: { flexDirection: 'row' },
  iconBtn: { marginLeft: Spacing.sm },
  scroll: { padding: Spacing.md, gap: 12 },
  mainCard: {},
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  deviceName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  historyBtn: { borderWidth: 1, borderColor: Colors.textPrimary, borderRadius: 100, paddingHorizontal: 12, paddingVertical: 4 },
  historyBtnText: { fontSize: 12, color: Colors.textPrimary },
  cardDate: { fontSize: 12, color: Colors.textSecondary, marginBottom: 4 },
  weightRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 4 },
  weightText: { fontSize: 32, fontWeight: 'bold', color: Colors.textPrimary },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 8 },
  weightClassBadge: { borderWidth: 1, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4, marginLeft: 8 },
  weightClassText: { fontSize: 12, fontWeight: '600' },
  deltaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  deltaValue: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  deltaLabel: { fontSize: 11, color: Colors.textSecondary },
  startWeighBtn: { backgroundColor: Colors.gradientPrimaryStart, borderRadius: 100, paddingVertical: 16, alignItems: 'center' },
  startWeighText: { color: '#fff', fontSize: FontSize.lg, fontWeight: 'bold' },
  cardTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  trendCard: {
    backgroundColor: Colors.background, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#F0F0F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1,
  },
  trendIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E3F0FF', justifyContent: 'center', alignItems: 'center' },
  waterAmtText: { color: Colors.water, fontWeight: '600', fontSize: FontSize.md },
});
