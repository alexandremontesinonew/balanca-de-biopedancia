import { create } from 'zustand';
import { getDatabase } from '@/src/lib/database';
import type { User, Measurement, Device, WaterIntake, FamilyMember } from '@/src/types';

interface AppState {
  // User
  user: User | null;
  setUser: (user: User) => void;
  loadUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;

  // Measurements
  measurements: Measurement[];
  latestMeasurement: Measurement | null;
  loadMeasurements: () => Promise<void>;
  addMeasurement: (m: Omit<Measurement, 'id' | 'created_at'>) => Promise<void>;
  getHistory: (limit?: number) => Measurement[];

  // Devices
  devices: Device[];
  loadDevices: () => Promise<void>;
  addDevice: (d: Omit<Device, 'id' | 'created_at'>) => Promise<void>;
  removeDevice: (id: number) => Promise<void>;
  updateDevice: (id: number, data: Partial<Device>) => Promise<void>;

  // Water intake
  waterIntakes: WaterIntake[];
  todayWaterMl: number;
  waterGoalMl: number;
  loadWaterIntakes: (date: string) => Promise<void>;
  addWaterIntake: (beverage: string, amountMl: number) => Promise<void>;

  // Family members
  familyMembers: FamilyMember[];
  loadFamilyMembers: () => Promise<void>;
  addFamilyMember: (m: Omit<FamilyMember, 'id' | 'created_at'>) => Promise<void>;
  removeFamilyMember: (id: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // ─── User ───────────────────────────────────────────────────────────────
  user: null,
  setUser: (user) => set({ user }),

  loadUser: async () => {
    const db = await getDatabase();
    const user = await db.getFirstAsync<User>('SELECT * FROM users LIMIT 1');
    if (user) set({ user });
  },

  updateUser: async (data) => {
    const db = await getDatabase();
    const fields = Object.keys(data)
      .map((k) => `${k} = ?`)
      .join(', ');
    const values = [...Object.values(data), Date.now()];
    await db.runAsync(
      `UPDATE users SET ${fields}, updated_at = datetime('now') WHERE id = 1`,
      values.slice(0, -1)
    );
    await get().loadUser();
  },

  // ─── Measurements ────────────────────────────────────────────────────────
  measurements: [],
  latestMeasurement: null,

  loadMeasurements: async () => {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Measurement>(
      'SELECT * FROM measurements WHERE user_id = 1 ORDER BY datetime DESC'
    );
    set({
      measurements: rows,
      latestMeasurement: rows[0] ?? null,
    });
  },

  addMeasurement: async (m) => {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO measurements (
        user_id, datetime, weight_kg, bmi, body_fat_pct, fat_weight_kg,
        skeletal_muscle_pct, skeletal_muscle_weight_kg, muscle_rate_pct, muscle_weight_kg,
        water_pct, water_weight_kg, visceral_fat, bone_weight_kg, bmr,
        protein_pct, obesity_pct, metabolic_age, lbm_kg, real_age, height_cm, raw_impedance
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        m.user_id, m.datetime, m.weight_kg, m.bmi, m.body_fat_pct, m.fat_weight_kg,
        m.skeletal_muscle_pct, m.skeletal_muscle_weight_kg, m.muscle_rate_pct, m.muscle_weight_kg,
        m.water_pct, m.water_weight_kg, m.visceral_fat, m.bone_weight_kg, m.bmr,
        m.protein_pct, m.obesity_pct, m.metabolic_age, m.lbm_kg, m.real_age, m.height_cm,
        m.raw_impedance ?? null,
      ]
    );
    await get().loadMeasurements();
  },

  getHistory: (limit = 100) => {
    return get().measurements.slice(0, limit);
  },

  // ─── Devices ─────────────────────────────────────────────────────────────
  devices: [],

  loadDevices: async () => {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Device>(
      'SELECT * FROM devices WHERE user_id = 1 ORDER BY created_at DESC'
    );
    set({ devices: rows });
  },

  addDevice: async (d) => {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT OR REPLACE INTO devices (user_id, name, mac, manufacturer, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [d.user_id, d.name, d.mac, d.manufacturer ?? null, d.phone ?? null, d.address ?? null]
    );
    await get().loadDevices();
  },

  removeDevice: async (id) => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM devices WHERE id = ?', [id]);
    await get().loadDevices();
  },

  updateDevice: async (id, data) => {
    const db = await getDatabase();
    const fields = Object.keys(data).map((k) => `${k} = ?`).join(', ');
    await db.runAsync(
      `UPDATE devices SET ${fields} WHERE id = ?`,
      [...Object.values(data), id]
    );
    await get().loadDevices();
  },

  // ─── Water ───────────────────────────────────────────────────────────────
  waterIntakes: [],
  todayWaterMl: 0,
  waterGoalMl: 2637,

  loadWaterIntakes: async (date: string) => {
    const db = await getDatabase();
    const rows = await db.getAllAsync<WaterIntake>(
      "SELECT * FROM water_intake WHERE user_id = 1 AND date = ? ORDER BY created_at DESC",
      [date]
    );
    const total = rows.reduce((sum, r) => sum + r.amount_ml, 0);
    set({ waterIntakes: rows, todayWaterMl: total });
  },

  addWaterIntake: async (beverage, amountMl) => {
    const db = await getDatabase();
    const today = new Date().toISOString().split('T')[0];
    await db.runAsync(
      'INSERT INTO water_intake (user_id, date, amount_ml, beverage_type) VALUES (?, ?, ?, ?)',
      [1, today, amountMl, beverage]
    );
    await get().loadWaterIntakes(today);
  },

  // ─── Family ──────────────────────────────────────────────────────────────
  familyMembers: [],

  loadFamilyMembers: async () => {
    const db = await getDatabase();
    const rows = await db.getAllAsync<FamilyMember>(
      'SELECT * FROM family_members WHERE owner_id = 1 ORDER BY created_at ASC'
    );
    set({ familyMembers: rows });
  },

  addFamilyMember: async (m) => {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO family_members (owner_id, name, birthdate, height_cm, sex) VALUES (?, ?, ?, ?, ?)',
      [m.owner_id, m.name, m.birthdate, m.height_cm, m.sex]
    );
    await get().loadFamilyMembers();
  },

  removeFamilyMember: async (id) => {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM family_members WHERE id = ?', [id]);
    await get().loadFamilyMembers();
  },
}));
