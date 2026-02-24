import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, SafeAreaView, StatusBar,
  Modal, TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store';
import { Colors, Spacing, FontSize } from '@/src/constants/theme';

export default function FamilyScreen() {
  const router = useRouter();
  const { familyMembers, loadFamilyMembers, addFamilyMember, removeFamilyMember } = useAppStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');

  useEffect(() => { loadFamilyMembers(); }, []);

  const handleAdd = async () => {
    if (!name || !birthdate || !height) {
      Alert.alert('Preencha todos os campos');
      return;
    }
    await addFamilyMember({
      owner_id: 1,
      name,
      birthdate,
      height_cm: parseFloat(height),
      sex,
    });
    setModalVisible(false);
    setName(''); setBirthdate(''); setHeight('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.textPrimary} />
          <Text style={styles.headerTitle}>Membro da família</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="plus-circle-outline" size={26} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {familyMembers.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="package-variant-closed" size={80} color={Colors.textDisabled} />
          <Text style={styles.emptyText}>Sem Membros da Família</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.addBtnText}>Adicionar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={familyMembers}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ padding: Spacing.md, gap: 10 }}
          renderItem={({ item }) => (
            <View style={styles.memberCard}>
              <View style={styles.memberAvatar}>
                <MaterialCommunityIcons name="account" size={28} color={Colors.primary} />
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberDetail}>{item.birthdate} · {item.height_cm}cm · {item.sex === 'male' ? 'M' : 'F'}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFamilyMember(item.id)}>
                <MaterialCommunityIcons name="trash-can-outline" size={22} color="#F44336" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Modal adicionar */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Adicionar Membro</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={name}
              onChangeText={setName}
              placeholderTextColor={Colors.textDisabled}
            />
            <TextInput
              style={styles.input}
              placeholder="Data de nascimento (YYYY-MM-DD)"
              value={birthdate}
              onChangeText={setBirthdate}
              placeholderTextColor={Colors.textDisabled}
            />
            <TextInput
              style={styles.input}
              placeholder="Altura (cm)"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
              placeholderTextColor={Colors.textDisabled}
            />

            <View style={styles.sexRow}>
              {(['male', 'female'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.sexBtn, sex === s && styles.sexBtnActive]}
                  onPress={() => setSex(s)}
                >
                  <Text style={[styles.sexBtnText, sex === s && styles.sexBtnTextActive]}>
                    {s === 'male' ? 'Masculino' : 'Feminino'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
              <Text style={styles.addBtnText}>Adicionar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
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
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  emptyText: { fontSize: FontSize.lg, color: Colors.textSecondary },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundAlt,
    borderRadius: 12,
    padding: Spacing.md,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberInfo: { flex: 1 },
  memberName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  memberDetail: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  addBtn: {
    backgroundColor: Colors.gradientPrimaryStart,
    borderRadius: 100,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: FontSize.md, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.lg,
    gap: 12,
  },
  modalTitle: { fontSize: FontSize.xl, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  sexRow: { flexDirection: 'row', gap: 12 },
  sexBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  sexBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sexBtnText: { fontSize: FontSize.md, color: Colors.textSecondary },
  sexBtnTextActive: { color: '#fff', fontWeight: '600' },
  cancelBtn: { paddingVertical: 12, alignItems: 'center' },
  cancelBtnText: { fontSize: FontSize.md, color: Colors.textSecondary },
});
