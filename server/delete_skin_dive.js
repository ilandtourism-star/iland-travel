const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'iland_v2.db');
const db = new Database(dbPath);

console.log('Deleting skin-dive-experience-perhentian from database...');

const stmt = db.prepare('DELETE FROM vacations WHERE sku = ?');
const info = stmt.run('skin-dive-experience-perhentian');

console.log(`Deleted ${info.changes} rows.`);
db.close();
