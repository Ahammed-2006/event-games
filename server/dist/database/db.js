"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbRun = exports.dbAll = exports.dbGet = exports.db = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.resolve(__dirname, '../../database.sqlite');
exports.db = new sqlite3_1.default.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    }
    else {
        exports.db.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000; PRAGMA synchronous=NORMAL;', () => { });
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
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
  `;
    exports.db.exec(schema, (err) => {
        if (err) {
            console.error('Error executing schema', err.message);
        }
        else {
            console.log('Schema loaded successfully.');
            seedEventState();
        }
    });
}
function seedEventState() {
    exports.db.get('SELECT COUNT(*) as count FROM event_state', (err, row) => {
        if (row && row.count === 0) {
            exports.db.run('INSERT INTO event_state (event_status) VALUES (?)', ['WAITING']);
        }
    });
}
// Promisified wrappers
const dbGet = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        exports.db.get(sql, params, (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
};
exports.dbGet = dbGet;
const dbAll = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        exports.db.all(sql, params, (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
};
exports.dbAll = dbAll;
const dbRun = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        exports.db.run(sql, params, function (err) {
            if (err)
                reject(err);
            else
                resolve(this);
        });
    });
};
exports.dbRun = dbRun;
