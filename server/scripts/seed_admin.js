const db = require('../db');
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
    const adminUser = 'admin';
    const adminPass = 'password123';

    try {
        // Check if admin exists
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = stmt.get(adminUser);

        if (!user) {
            console.log('Creating default admin user...');
            const hash = await bcrypt.hash(adminPass, 10);
            const insert = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)');
            insert.run(adminUser, hash, 'admin');
            console.log(`Admin created: ${adminUser} / ${adminPass}`);
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    }
};

seedAdmin();
