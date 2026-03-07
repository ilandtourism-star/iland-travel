const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'iland.db');
const db = new Database(dbPath, { verbose: console.log });

console.log('Running migration...');

try {
    // Add owner_id to vacations if it doesn't exist
    try {
        db.prepare('ALTER TABLE vacations ADD COLUMN owner_id INTEGER').run();
        console.log('Added owner_id to vacations.');
    } catch (err) {
        if (err.message.includes('duplicate column')) {
            console.log('owner_id already exists in vacations.');
        } else {
            console.error('Error adding owner_id:', err.message);
        }
    }

    // Add vacation_sku to bookings if it doesn't exist
    try {
        db.prepare('ALTER TABLE bookings ADD COLUMN vacation_sku TEXT').run();
        console.log('Added vacation_sku to bookings.');
    } catch (err) {
        if (err.message.includes('duplicate column')) {
            console.log('vacation_sku already exists in bookings.');
        } else {
            console.error('Error adding vacation_sku:', err.message);
        }
    }

    // Verify
    const vacInfo = db.prepare("PRAGMA table_info(vacations)").all();
    console.log('Vacations columns:', vacInfo.map(c => c.name));

    const bookInfo = db.prepare("PRAGMA table_info(bookings)").all();
    console.log('Bookings columns:', bookInfo.map(c => c.name));

} catch (error) {
    console.error('Migration failed:', error);
}

db.close();
