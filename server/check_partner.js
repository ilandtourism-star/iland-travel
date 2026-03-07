const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'iland.db');
const db = new Database(dbPath);

const checkPartner = () => {
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get('partner_demo');
    if (user) {
        console.log('Partner user found:', user);
    } else {
        console.log('Partner user NOT found.');
    }
};

checkPartner();
