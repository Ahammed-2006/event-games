import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(__dirname, '../../database.sqlite');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA synchronous=NORMAL;', () => {});
    console.log('Connected to the SQLite database.');
    initDb();
  }
});

function initDb() {
  const schema = `
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
  active BOOLEAN DEFAULT 1
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
  event_status TEXT DEFAULT 'WAITING',
  word_search_locked BOOLEAN DEFAULT 0,
  jigsaw_locked BOOLEAN DEFAULT 0,
  debug_code_locked BOOLEAN DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
  `;
  db.exec(schema, (err) => {
    if (err) {
      console.error('Error executing schema', err.message);
    } else {
      console.log('Schema loaded successfully.');
      seedEventState();
    }
  });
}

function seedEventState() {
  db.get('SELECT COUNT(*) as count FROM event_state', (err, row: any) => {
    if (row && row.count === 0) {
      db.run('INSERT INTO event_state (event_status) VALUES (?)', ['WAITING']);
    }
  });
}

// Promisified wrappers
export const dbGet = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const dbAll = (sql: string, params: any[] = []): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const dbRun = (sql: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};
