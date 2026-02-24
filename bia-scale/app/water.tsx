import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar,
  Modal, Animated, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store';
import { Colors, Spacing, FontSize } from '@/src/constants/theme';

const { width } = Dimensions.get('window');

interface Beverage {
  id: string;
  name: string;
  icon: string;
  color: string;
  percentage: number; // 0-100 water content
}

const BEVERAGES: Beverage[] = [
  { id: 'water', name: 'Água', icon: 'water', color: '#00BCD4', percentage: 100 },
  { id: 'sparkling', name: 'Água com gás', icon: 'bottle-soda', color: '#4FC3F7', percentage: 100 },
  { id: 'sparkling2', name: 'Água com gás 2', icon: 'bottle-soda-outline', color: '#29B6F6', percentage: 100 },
  { id: 'coconut_water', name: 'Água de coco', icon: 'fruit-watermelon', color: '#A5D6A7', percentage: 95 },
  { id: 'coconut_milk', name: 'Leite de coco', icon: 'palm-tree', color: '#FFCC80', percentage: 70 },
  { id: 'milk', name: 'Leite', icon: 'bottle-tonic', color: '#FFF9C4', percentage: 87 },
  { id: 'yogurt', name: 'Iogurte', icon: 'cup', color: '#F8BBD9', percentage: 85 },
  { id: 'almond_milk', name: 'Leite de amêndoa', icon: 'seed', color: '#FFE0B2', percentage: 90 },
  { id: 'soup', name: 'Sopa', icon: 'bowl-mix', color: '#FFAB40', percentage: 80 },
  { id: 'oat_milk', name: 'Leite de aveia', icon: 'grain', color: '#D7CCC8', percentage: 90 },
  { id: 'coffee', name: 'Café', icon: 'coffee', color: '#795548', percentage: 98 },
  { id: 'decaf', name: 'Descafeinado', icon: 'coffee-outline', color: '#A1887F', percentage: 98 },
];

const PAGES_SIZE = 4;

export default function WaterScreen() {
  const router = useRouter();
  const { todayWaterMl, waterGoalMl, addWaterIntake, loadWaterIntakes } = useAppStore();
  const [selected, setSelected] = useState<Beverage>(BEVERAGES[0]);
  const [amount, setAmount] = useState(250);
  const [currentPage, setCurrentPage] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const fillAnim = useRef(new Animated.Value(0)).current;

  const today = new Date().toISOString().split('T')[0];
  const totalPages = Math.ceil(BEVERAGES.length / PAGES_SIZE);
  const pageBeverages = BEVERAGES.slice(currentPage * PAGES_SIZE, (currentPage + 1) * PAGES_SIZE);

  useEffect(() => {
    loadWaterIntakes(today);
  }, []);

  useEffect(() => {
    const pct = waterGoalMl > 0 ? Math.min(1, todayWaterMl / waterGoalMl) : 0;
    Animated.spring(fillAnim, { toValue: pct, useNativeDriver: false }).start();
  }, [todayWaterMl, waterGoalMl]);

  const handleAdd = async () => {
    await addWaterIntake(selected.id, amount * selected.percentage / 100);
  };

  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const waterPct = waterGoalMl > 0 ? Math.round(todayWaterMl / waterGoalMl * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.textPrimary} />
          <Text style={styles.headerTitle}>Água</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowCalendar(true)}>
          <MaterialCommunityIcons name="calendar-month" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Copo animado */}
        <View style={styles.cupArea}>
          <View style={styles.cupWrapper}>
            {/* Copo */}
            <View style={styles.cup}>
              {/* Nível de água animado */}
              <Animated.View
                style={[
                  styles.waterFill,
                  { height: fillHeight },
                ]}
              />
              {/* Setas dentro do copo */}
              <TouchableOpacity
                style={styles.cupArrowUp}
                onPress={() => setAmount((a) => Math.min(a + 50, 1000))}
              >
                <MaterialCommunityIcons name="chevron-up" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cupArrowDown}
                onPress={() => setAmount((a) => Math.max(a - 50, 50))}
              >
                <MaterialCommunityIcons name="chevron-down" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Tooltip primeiro uso */}
            {showWelcome && todayWaterMl === 0 && (
              <View style={styles.tooltip}>
                <Text style={styles.tooltipText}>Clique para experimentar</Text>
                <View style={styles.tooltipArrow} />
              </View>
            )}
          </View>

          {/* Garrafa */}
          <TouchableOpacity style={styles.bottleBtn}>
            <MaterialCommunityIcons name="cup-water" size={40} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Quantidade */}
        <View style={styles.amountRow}>
          <Text style={styles.amountText}>{amount}ml</Text>
          <TouchableOpacity>
            <MaterialCommunityIcons name="pencil" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <Text style={styles.statsText}>
          {todayWaterMl}ml de {waterGoalMl}ml ({waterPct}%)
        </Text>

        {/* Carrossel de bebidas */}
        <View style={styles.carouselWrapper}>
          <View style={styles.carouselRow}>
            {pageBeverages.map((bev) => (
              <TouchableOpacity
                key={bev.id}
                style={[
                  styles.beverageItem,
                  selected.id === bev.id && styles.beverageItemSelected,
                ]}
                onPress={() => setSelected(bev)}
              >
                <View style={[styles.beverageIcon, { backgroundColor: bev.color + '33' }]}>
                  <MaterialCommunityIcons name={bev.icon as any} size={28} color={bev.color} />
                </View>
                <Text style={styles.beverageName} numberOfLines={1}>{bev.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {totalPages > 1 && (
            <View style={styles.paginationRow}>
              {Array.from({ length: totalPages }).map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.pageDot, i === currentPage && styles.pageDotActive]}
                  onPress={() => setCurrentPage(i)}
                />
              ))}
              <TouchableOpacity
                style={styles.pageNextBtn}
                onPress={() => setCurrentPage((p) => (p + 1) % totalPages)}
              >
                <MaterialCommunityIcons name="chevron-right" size={16} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botão adicionar */}
      <View style={styles.bottomBtn}>
        <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
          <Text style={styles.addBtnText}>Adicionar · {selected.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Modal */}
      <Modal visible={showWelcome && todayWaterMl === 0} transparent animationType="fade">
        <View style={styles.welcomeOverlay}>
          <View style={styles.welcomeSheet}>
            <Text style={styles.welcomeEmoji}>💧</Text>
            <Text style={styles.welcomeTitle}>Bem-vindo/a a usar a função de beber água</Text>
            <Text style={styles.welcomeBody}>
              Defina um objetivo de consumo de água que se adeque a você, e ajudaremos você a desenvolver hábitos saudáveis de beber água
            </Text>
            <TouchableOpacity style={styles.welcomeBtn} onPress={() => setShowWelcome(false)}>
              <Text style={styles.welcomeBtnText}>confirme</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal visible={showCalendar} transparent animationType="slide" onRequestClose={() => setShowCalendar(false)}>
        <View style={styles.calendarOverlay}>
          <View style={styles.calendarSheet}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>xmontesino — {today.slice(0, 7).replace('-', '/')}</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <MaterialCommunityIcons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {/* Semana */}
            <View style={styles.weekRow}>
              {Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - 6 + i);
                const isToday = d.toDateString() === new Date().toDateString();
                return (
                  <View key={i} style={[styles.dayCol, isToday && styles.dayColActive]}>
                    <Text style={[styles.dayNum, isToday && styles.dayNumActive]}>{d.getDate()}</Text>
                    <MaterialCommunityIcons name="water-outline" size={16} color={isToday ? Colors.water : Colors.textDisabled} />
                  </View>
                );
              })}
            </View>

            <Text style={styles.calendarWaterText}>{todayWaterMl}ml</Text>

            <View style={styles.calendarStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0 dias</Text>
                <Text style={styles.statLabel}>Beber continuamente</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{Math.round(todayWaterMl / 7)}ml</Text>
                <Text style={styles.statLabel}>Média da semana</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textPrimary },
  scroll: { padding: Spacing.md, alignItems: 'center' },
  cupArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.md,
  },
  cupWrapper: { position: 'relative', alignItems: 'center' },
  cup: {
    width: 120,
    height: 180,
    borderWidth: 3,
    borderColor: Colors.water,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.waterLight,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.water + '88',
  },
  cupArrowUp: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cupArrowDown: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  tooltip: {
    position: 'absolute',
    bottom: -50,
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 8,
  },
  tooltipText: { color: '#fff', fontSize: 12 },
  tooltipArrow: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -8,
    borderWidth: 8,
    borderColor: 'transparent',
    borderBottomColor: '#333',
  },
  bottleBtn: { marginLeft: 20 },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.md,
  },
  amountText: { fontSize: 28, fontWeight: 'bold', color: Colors.textPrimary },
  statsText: { fontSize: 13, color: Colors.textSecondary, marginVertical: 8 },
  carouselWrapper: { width: '100%', marginTop: Spacing.md },
  carouselRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  beverageItem: { alignItems: 'center', width: 70 },
  beverageItemSelected: {
    borderWidth: 2,
    borderColor: Colors.water,
    borderRadius: 12,
    padding: 4,
  },
  beverageIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  beverageName: { fontSize: 10, color: Colors.textSecondary, textAlign: 'center' },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  pageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textDisabled,
  },
  pageDotActive: { backgroundColor: Colors.water },
  pageNextBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.waterLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  addBtn: {
    backgroundColor: Colors.water,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
  welcomeOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  welcomeSheet: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  welcomeEmoji: { fontSize: 48 },
  welcomeTitle: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  welcomeBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  welcomeBtn: {
    backgroundColor: Colors.water,
    borderRadius: 100,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 8,
  },
  welcomeBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  calendarSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.md,
    paddingBottom: 40,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  calendarTitle: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  dayCol: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  dayColActive: { backgroundColor: Colors.waterLight },
  dayNum: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  dayNumActive: { color: Colors.water },
  calendarWaterText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.water,
    textAlign: 'center',
    marginVertical: 12,
  },
  calendarStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: Spacing.md,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: FontSize.lg, fontWeight: 'bold', color: Colors.textPrimary },
  statLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});
