-- schema.sql
CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME,
  status TEXT DEFAULT 'not-started', -- not-started, in-progress, completed, banned
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
  status TEXT DEFAULT 'in-progress', -- in-progress, completed
  FOREIGN KEY(student_id) REFERENCES students(id),
  FOREIGN KEY(challenge_id) REFERENCES challenges(id)
);

CREATE TABLE IF NOT EXISTS answers (
  id TEXT PRIMARY KEY,
  attempt_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  answer TEXT,
  correct BOOLEAN DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(attempt_id) REFERENCES attempts(id)
);

CREATE TABLE IF NOT EXISTS event_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_status TEXT DEFAULT 'WAITING', -- WAITING, RUNNING, PAUSED, ENDED
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
