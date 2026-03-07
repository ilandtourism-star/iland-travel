const fs = require('fs');
const path = require('path');
const db = require('../db');

const backupDir = path.resolve(__dirname, '../backups');
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(backupDir, `iland-${timestamp}.db`);

console.log(`--- Starting Backup to ${backupFile} ---`);

try {
    // Use SQLite Online Backup API via better-sqlite3
    db.backup(backupFile)
        .then(() => {
            console.log('✅ Backup successful!');
        })
        .catch((err) => {
            console.error('❌ Backup failed:', err);
        });
} catch (err) {
    console.error('Backup Error:', err);
}
