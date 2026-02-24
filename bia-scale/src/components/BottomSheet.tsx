import React from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize } from '@/src/constants/theme';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function AddBottomSheet({ visible, onClose }: Props) {
  const router = useRouter();

  const actions = [
    {
      icon: 'scale-bathroom' as const,
      label: 'Peso',
      color: Colors.primary,
      onPress: () => { onClose(); router.push('/ble-scan'); },
    },
    {
      icon: 'cup-water' as const,
      label: 'Beber água',
      color: Colors.primary,
      onPress: () => { onClose(); router.push('/water'); },
    },
    {
      icon: 'tape-measure' as const,
      label: 'Corpo',
      color: Colors.primary,
      onPress: () => { onClose(); },
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.sheet}>
        {/* Drag handle */}
        <View style={styles.handle} />

        <View style={styles.actionsRow}>
          {actions.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionItem}
              onPress={action.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F0FF' }]}>
                <MaterialCommunityIcons name={action.icon} size={28} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addDeviceBtn}
          onPress={() => { onClose(); router.push('/device'); }}
        >
          <Text style={styles.addDeviceBtnText}>Adicionar dispositivo</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.md,
    paddingTop: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  actionItem: { alignItems: 'center', width: 80 },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  actionLabel: { fontSize: FontSize.sm, color: Colors.textPrimary, textAlign: 'center' },
  addDeviceBtn: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: Spacing.md,
  },
  addDeviceBtnText: {
    color: Colors.primary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
});
