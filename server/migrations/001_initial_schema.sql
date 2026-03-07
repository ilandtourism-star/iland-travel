-- Initial Schema Migration

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- 'user', 'admin', 'partner'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  firstName TEXT NOT NULL,
  email TEXT NOT NULL,
  packageName TEXT NOT NULL,
  vacation_sku TEXT, -- Link to vacation
  date TEXT,
  pax INTEGER,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  total_price REAL DEFAULT 0,
  commission_amount REAL DEFAULT 0,
  net_amount REAL DEFAULT 0,
  status TEXT DEFAULT 'confirmed',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vacations (
  sku TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL,
  childPrice REAL,
  image TEXT,
  owner_id INTEGER, -- Link to user (partner)
  max_pax INTEGER DEFAULT 12 -- Capacity for this activity
);

CREATE TABLE IF NOT EXISTS availability (
  vacation_sku TEXT NOT NULL,
  date TEXT NOT NULL,
  remaining_pax INTEGER NOT NULL,
  PRIMARY KEY (vacation_sku, date)
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  vacation_sku TEXT NOT NULL,
  booking_id TEXT,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS season_listeners (
  email TEXT NOT NULL,
  vacation_sku TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (email, vacation_sku)
);
