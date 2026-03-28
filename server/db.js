const Database = require('better-sqlite3');
const path = require('path');

const { runMigrations } = require('./lib/migrate/runner');

// Initialize DB
const defaultDbPath = path.resolve(__dirname, 'iland_v2.db');
const dbPath = process.env.DB_PATH || defaultDbPath;
let db;
let dbHealthy = false;

try {
  db = new Database(dbPath, { timeout: 10000 });
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = ON');

  runMigrations(db);

  // Seed default settings
  const seedSettings = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');

  dbHealthy = true;
} catch (err) {
  console.error("CRITICAL: Database Storage Failure!", err);
  dbHealthy = false;
  // Create a mock db object to allow app to start but API to fail gracefully
  db = {
    prepare: () => ({
      get: () => { throw new Error('Storage Unavailable'); },
      all: () => { throw new Error('Storage Unavailable'); },
      run: () => { throw new Error('Storage Unavailable'); }
    }),
    pragma: () => { }
  };
}

db.isHealthy = () => dbHealthy;

/**
 * Data Access Layer (DAL) Methods
 * Menambah fungsi pembantu terus ke objek pangkalan data.
 */

// 1. Ambil Senarai Percutian (dengan filter dinamik & review stats)
db.getVacations = (options = {}) => {
  let query = `
        SELECT v.*, 
               COUNT(r.id) as review_count, 
               AVG(r.rating) as avg_rating
        FROM vacations v
        LEFT JOIN reviews r ON v.sku = r.vacation_sku
    `;

  let params = [];
  let conditions = [];

  if (options.island) {
    conditions.push("v.island = ?");
    params.push(options.island);
  }
  if (options.category) {
    conditions.push("v.category = ?");
    params.push(options.category);
  }
  if (options.sku) {
    conditions.push("v.sku = ?");
    params.push(options.sku);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " GROUP BY v.sku ORDER BY CAST(v.name AS INTEGER) ASC, v.name ASC";

  const stmt = db.prepare(query);
  return options.sku ? stmt.get(...params) : stmt.all(...params);
};

// 2. Daftar Peminat Musim (Season Listener)
db.addSeasonListener = (email, sku) => {
  const stmt = db.prepare(`
        INSERT OR IGNORE INTO season_listeners (email, vacation_sku) 
        VALUES (?, ?)
    `);
  return stmt.run(email, sku);
};

module.exports = db;
