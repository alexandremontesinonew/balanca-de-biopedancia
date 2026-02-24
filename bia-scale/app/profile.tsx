import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, SafeAreaView, StatusBar, TextInput, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppStore } from '@/src/store';
import { Colors, Spacing, FontSize } from '@/src/constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, loadUser, updateUser } = useAppStore();
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [height, setHeight] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState(3);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBirthdate(user.birthdate);
      setHeight(String(user.height_cm));
      setSex(user.sex);
      setActivityLevel(user.activity_level);
    }
  }, [user]);

  const handleSave = async () => {
    await updateUser({
      name,
      birthdate,
      height_cm: parseFloat(height) || 180,
      sex,
      activity_level: activityLevel as 1 | 2 | 3 | 4 | 5,
    });
    Alert.alert('Perfil atualizado!');
    router.back();
  };

  const activityLabels = ['Sedentário', 'Leve', 'Moderado', 'Ativo', 'Muito ativo'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={28} color={Colors.textPrimary} />
          <Text style={styles.headerTitle}>Meu perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor={Colors.textDisabled}
        />

        <Text style={styles.label}>Data de nascimento</Text>
        <TextInput
          style={styles.input}
          value={birthdate}
          onChangeText={setBirthdate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Colors.textDisabled}
        />

        <Text style={styles.label}>Altura (cm)</Text>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
          placeholderTextColor={Colors.textDisabled}
        />

        <Text style={styles.label}>Sexo</Text>
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

        <Text style={styles.label}>Nível de atividade</Text>
        <View style={styles.activityRow}>
          {[1, 2, 3, 4, 5].map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.activityBtn, activityLevel === level && styles.activityBtnActive]}
              onPress={() => setActivityLevel(level)}
            >
              <Text style={[styles.activityBtnNum, activityLevel === level && styles.activityBtnNumActive]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.activityLabel}>
          {activityLabels[activityLevel - 1]}
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
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
  saveText: { fontSize: FontSize.md, color: Colors.primary, fontWeight: '700' },
  scroll: { padding: Spacing.md, gap: 8 },
  label: { fontSize: 13, color: Colors.textSecondary, marginTop: 8 },
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
  activityRow: { flexDirection: 'row', gap: 8 },
  activityBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  activityBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  activityBtnNum: { fontSize: FontSize.md, color: Colors.textSecondary, fontWeight: '600' },
  activityBtnNumActive: { color: '#fff' },
  activityLabel: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginTop: 4 },
});
