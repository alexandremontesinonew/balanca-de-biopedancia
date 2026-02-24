import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store';
import { Colors, Spacing, FontSize } from '@/src/constants/theme';

interface SettingsRow {
  icon: string;
  iconColor?: string;
  label: string;
  badge?: string;
  route?: string;
}

interface SettingsGroup {
  rows: SettingsRow[];
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, loadUser } = useAppStore();

  useEffect(() => { loadUser(); }, []);

  const age = user?.age ?? 43;
  const height = user?.height_cm ?? 180;

  const groups: SettingsGroup[] = [
    {
      rows: [
        { icon: 'account', label: 'Meu perfil', badge: `\u{1F382}${age} | ${height}cm`, route: '/profile' },
        { icon: 'account-group', label: 'Membro da fam\u00EDlia', route: '/family' },
      ],
    },
    {
      rows: [
        { icon: 'bell-outline', label: 'Lembrete de notifica\u00E7\u00E3o', route: '/notifications' },
        { icon: 'web', label: 'Configura\u00E7\u00F5es de unidade/idioma', route: '/language' },
      ],
    },
    {
      rows: [
        { icon: 'heart-outline', iconColor: '#F44336', label: 'Centro de Ajuda', route: '/help' },
        { icon: 'emoticon-happy-outline', label: 'Feedback', route: '/feedback' },
      ],
    },
    {
      rows: [
        { icon: 'crown-outline', label: 'Estilo de tema', badge: '\uD83D\uDD25', route: '/theme' },
        { icon: 'view-grid-outline', label: 'Widget', route: '/widget' },
      ],
    },
    {
      rows: [
        { icon: 'package-variant', label: 'Dispositivo', route: '/device' },
        { icon: 'information-outline', label: 'Defini\u00E7\u00F5es', route: '/definitions' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FF9A9E" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header gradient */}
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Ol\u00E1,{user?.name ?? 'xmontesino'}</Text>
              <Text style={styles.subGreeting}>
                OKOK Ajudou Voc\u00EA a Gerenciar{'\n'}o Peso por 0 Dias
              </Text>
            </View>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account" size={30} color="#fff" />
            </View>
          </View>
        </View>

        {/* Grupos */}
        {groups.map((group, gi) => (
          <View key={gi} style={styles.group}>
            {group.rows.map((row, ri) => (
              <TouchableOpacity
                key={ri}
                style={[styles.row, ri < group.rows.length - 1 && styles.rowBorder]}
                onPress={() => row.route && router.push(row.route as any)}
              >
                <View style={styles.rowLeft}>
                  <MaterialCommunityIcons
                    name={row.icon as any}
                    size={22}
                    color={row.iconColor ?? Colors.textPrimary}
                    style={styles.rowIcon}
                  />
                  <Text style={styles.rowLabel}>{row.label}</Text>
                </View>
                <View style={styles.rowRight}>
                  {row.badge && (
                    <Text style={styles.rowBadge}>{row.badge}</Text>
                  )}
                  <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textSecondary} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundAlt },
  headerGradient: {
    backgroundColor: '#FF9A9E',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: '#fff',
  },
  subGreeting: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  group: {
    backgroundColor: Colors.background,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 16,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowIcon: { marginRight: 12 },
  rowLabel: { fontSize: FontSize.md, color: Colors.textPrimary },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowBadge: { fontSize: 13, color: Colors.textSecondary },
});
