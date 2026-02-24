import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('biascale.db');
  return db;
}

export async function initDatabase(): Promise<void> {
  const database = await getDatabase();

  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT 'xmontesino',
      birthdate TEXT NOT NULL DEFAULT '1983-01-01',
      age INTEGER NOT NULL DEFAULT 43,
      height_cm REAL NOT NULL DEFAULT 180,
      sex TEXT NOT NULL DEFAULT 'male',
      activity_level INTEGER NOT NULL DEFAULT 3,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS measurements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      datetime TEXT NOT NULL,
      weight_kg REAL NOT NULL,
      bmi REAL NOT NULL DEFAULT 0,
      body_fat_pct REAL NOT NULL DEFAULT 0,
      fat_weight_kg REAL NOT NULL DEFAULT 0,
      skeletal_muscle_pct REAL NOT NULL DEFAULT 0,
      skeletal_muscle_weight_kg REAL NOT NULL DEFAULT 0,
      muscle_rate_pct REAL NOT NULL DEFAULT 0,
      muscle_weight_kg REAL NOT NULL DEFAULT 0,
      water_pct REAL NOT NULL DEFAULT 0,
      water_weight_kg REAL NOT NULL DEFAULT 0,
      visceral_fat REAL NOT NULL DEFAULT 0,
      bone_weight_kg REAL NOT NULL DEFAULT 0,
      bmr REAL NOT NULL DEFAULT 0,
      protein_pct REAL NOT NULL DEFAULT 0,
      obesity_pct REAL NOT NULL DEFAULT 0,
      metabolic_age REAL NOT NULL DEFAULT 0,
      lbm_kg REAL NOT NULL DEFAULT 0,
      real_age INTEGER NOT NULL DEFAULT 0,
      height_cm REAL NOT NULL DEFAULT 180,
      raw_impedance REAL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      name TEXT NOT NULL,
      mac TEXT NOT NULL UNIQUE,
      manufacturer TEXT,
      phone TEXT,
      address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS water_intake (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL DEFAULT 1,
      date TEXT NOT NULL,
      amount_ml REAL NOT NULL,
      beverage_type TEXT NOT NULL DEFAULT 'water',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS family_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_id INTEGER NOT NULL DEFAULT 1,
      name TEXT NOT NULL,
      birthdate TEXT NOT NULL,
      height_cm REAL NOT NULL,
      sex TEXT NOT NULL DEFAULT 'male',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (owner_id) REFERENCES users(id)
    );
  `);

  await seedInitialData(database);
}

async function seedInitialData(database: SQLite.SQLiteDatabase): Promise<void> {
  // Check if user already exists
  const existing = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM users'
  );

  if (existing && existing.count > 0) return;

  // Insert seed user
  await database.runAsync(
    `INSERT INTO users (name, birthdate, age, height_cm, sex, activity_level)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ['xmontesino', '1983-01-01', 43, 180, 'male', 3]
  );

  // Insert seed device
  await database.runAsync(
    `INSERT INTO devices (user_id, name, mac)
     VALUES (?, ?, ?)`,
    [1, 'Balança Bluetooth1', '50:E4:52:A2:3E:4C']
  );

  // Insert seed measurement (current — 2026-02-24)
  await database.runAsync(
    `INSERT INTO measurements (
      user_id, datetime, weight_kg, bmi, body_fat_pct, fat_weight_kg,
      skeletal_muscle_pct, skeletal_muscle_weight_kg, muscle_rate_pct, muscle_weight_kg,
      water_pct, water_weight_kg, visceral_fat, bone_weight_kg, bmr,
      protein_pct, obesity_pct, metabolic_age, lbm_kg, real_age, height_cm
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      1, '2026-02-24T09:40:32', 113.75, 35.1, 34.7, 39.5,
      33.0, 37.5, 61.5, 70.0,
      48.8, 55.5, 27.0, 4.0, 2143.6,
      12.8, 62.5, 52.0, 74.29, 42, 180
    ]
  );

  // Insert previous measurement (2026-02-23) — peso anterior para calcular delta
  await database.runAsync(
    `INSERT INTO measurements (
      user_id, datetime, weight_kg, bmi, body_fat_pct, fat_weight_kg,
      skeletal_muscle_pct, skeletal_muscle_weight_kg, muscle_rate_pct, muscle_weight_kg,
      water_pct, water_weight_kg, visceral_fat, bone_weight_kg, bmr,
      protein_pct, obesity_pct, metabolic_age, lbm_kg, real_age, height_cm
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      1, '2026-02-23T08:30:00', 115.35, 35.6, 35.0, 40.4,
      32.8, 37.3, 61.2, 69.8,
      48.5, 55.9, 27.0, 4.0, 2150.0,
      12.7, 63.0, 52.0, 74.95, 42, 180
    ]
  );
}
