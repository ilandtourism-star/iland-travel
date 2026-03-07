const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, 'iland.db');
const db = new Database(dbPath);

console.log('Checking vacations table info...');
const columns = db.prepare('PRAGMA table_info(vacations)').all();
const columnNames = columns.map(c => c.name);
console.log('Current columns:', columnNames.join(', '));

if (!columnNames.includes('max_pax')) {
    console.log('Adding missing column: max_pax');
    db.prepare('ALTER TABLE vacations ADD COLUMN max_pax INTEGER DEFAULT 12').run();
    console.log('Column max_pax added successfully.');
} else {
    console.log('Column max_pax already exists.');
}

db.close();
console.log('Done.');
