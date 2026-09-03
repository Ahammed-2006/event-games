import sqlite3 from 'sqlite3';
import { Pool } from 'pg';
import path from 'path';

const usePg = !!process.env.DATABASE_URL;

let sqliteDb: sqlite3.Database;
let pgPool: Pool;

if (usePg) {
  pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });
  console.log('Connected to PostgreSQL database.');
  initDb();
} else {
  const dbPath = path.resolve(__dirname, '../../database.sqlite');
  sqliteDb = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening SQLite database', err.message);
    } else {
      sqliteDb.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA synchronous=NORMAL;', () => {});
      console.log('Connected to SQLite database.');
      initDb();
    }
  });
}

function initDb() {
  const sqliteSchema = `
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  status TEXT DEFAULT 'not-started',
  score INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  max_score INTEGER NOT NULL,
  active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  challenge_id TEXT NOT NULL,
  score INTEGER DEFAULT 0,
  started_at DATETIME,
  completed_at DATETIME,
  status TEXT DEFAULT 'in-progress',
  time_taken INTEGER DEFAULT 0,
  FOREIGN KEY(student_id) REFERENCES students(id),
  FOREIGN KEY(challenge_id) REFERENCES challenges(id)
);
CREATE TABLE IF NOT EXISTS event_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_status TEXT DEFAULT 'RUNNING',
  word_search_locked INTEGER DEFAULT 0,
  jigsaw_locked INTEGER DEFAULT 0,
  debug_code_locked INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
  `;

  const pgSchema = `
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  status TEXT DEFAULT 'not-started',
  score INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  max_score INTEGER NOT NULL,
  active INTEGER DEFAULT 1
);
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id),
  challenge_id TEXT REFERENCES challenges(id),
  score INTEGER DEFAULT 0,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  status TEXT DEFAULT 'in-progress',
  time_taken INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS event_state (
  id SERIAL PRIMARY KEY,
  event_status TEXT DEFAULT 'RUNNING',
  word_search_locked INTEGER DEFAULT 0,
  jigsaw_locked INTEGER DEFAULT 0,
  debug_code_locked INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
  `;

  const schema = usePg ? pgSchema : sqliteSchema;

  if (usePg) {
    pgPool.query(schema)
      .then(() => {
        console.log('PostgreSQL Schema loaded successfully.');
        seedEventState();
      })
      .catch(e => console.error('Error executing pg schema', e));
  } else {
    sqliteDb.exec(schema, (err) => {
      if (err) console.error('Error executing sqlite schema', err.message);
      else {
        console.log('SQLite Schema loaded successfully.');
        seedEventState();
      }
    });
  }
}

async function seedEventState() {
  const row = await dbGet('SELECT COUNT(*) as count FROM event_state');
  const count = parseInt(row.count, 10);
  if (count === 0) {
    await dbRun('INSERT INTO event_state (event_status) VALUES (?)', ['RUNNING']);
  } else {
    await dbRun('UPDATE event_state SET event_status = ? WHERE event_status = ?', ['RUNNING', 'WAITING']);
  }
}

const convertToPgSql = (sql: string) => {
  let i = 1;
  return sql.replace(/\?/g, () => `$${i++}`);
};

export const dbGet = async (sql: string, params: any[] = []): Promise<any> => {
  if (usePg) {
    const res = await pgPool.query(convertToPgSql(sql), params);
    return res.rows[0];
  }
  return new Promise((resolve, reject) => {
    sqliteDb.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = async (sql: string, params: any[] = []): Promise<any[]> => {
  if (usePg) {
    const res = await pgPool.query(convertToPgSql(sql), params);
    return res.rows;
  }
  return new Promise((resolve, reject) => {
    sqliteDb.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbRun = async (sql: string, params: any[] = []): Promise<any> => {
  if (usePg) {
    return pgPool.query(convertToPgSql(sql), params);
  }
  return new Promise((resolve, reject) => {
    sqliteDb.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};
