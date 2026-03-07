const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'iland.db');
const db = new Database(dbPath);

const createPartner = async () => {
    const username = 'partner_demo';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const insertUser = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)');
        const info = insertUser.run(username, hashedPassword, 'partner');
        console.log(`Partner user created! ID: ${info.lastInsertRowid}`);
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);

        // Assign a vacation to this partner
        const vacation = db.prepare('SELECT sku FROM vacations LIMIT 1').get();
        if (vacation) {
            db.prepare('UPDATE vacations SET owner_id = ? WHERE sku = ?').run(info.lastInsertRowid, vacation.sku);
            console.log(`Assigned vacation SKU ${vacation.sku} to partner.`);
        } else {
            console.log('No vacations found to assign.');
        }

    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            console.log('User already exists.');
        } else {
            console.error('Error:', err);
        }
    }
};

createPartner();
