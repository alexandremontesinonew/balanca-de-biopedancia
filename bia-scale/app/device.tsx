import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store';
import { Colors, Spacing, FontSize } from '@/src/constants/theme';

export default function DeviceScreen() {
  const router = useRouter();
  const { devices, loadDevices } = useAppStore();

  useEffect(() => { loadDevices(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.textPrimary} />
          <Text style={styles.headerTitle}>Dispositivo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/ble-scan')}>
          <MaterialCommunityIcons name="plus-circle-outline" size={26} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={devices}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="bluetooth-off" size={48} color={Colors.textDisabled} />
            <Text style={styles.emptyText}>Nenhum dispositivo pareado</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.deviceCard}
            onPress={() => router.push({ pathname: '/device-info', params: { id: item.id } })}
          >
            <View style={styles.deviceIcon}>
              <MaterialCommunityIcons name="scale-bathroom" size={28} color={Colors.primary} />
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>{item.name}</Text>
              <Text style={styles.deviceMac}>{item.mac}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      />

      <View style={styles.bottomBtn}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/ble-scan')}
        >
          <Text style={styles.addBtnText}>Adicionar dispositivo</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textPrimary },
  list: { padding: Spacing.md, gap: 10 },
  empty: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.md,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: '#E3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  deviceMac: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  bottomBtn: {
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  addBtn: {
    backgroundColor: Colors.gradientPrimaryStart,
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
});
