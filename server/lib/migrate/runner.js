const fs = require('fs');
const path = require('path');

const runMigrations = (db) => {
    console.log('--- Memulakan Proses Migrasi ---');

    // 1. Cipta jadual migrations jika belum ada
    db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

    const migrationsDir = path.resolve(__dirname, '../../migrations');

    if (!fs.existsSync(migrationsDir)) {
        console.log('Folder migrations tidak dijumpai.');
        return;
    }

    // 2. Baca semua fail .sql dalam folder migrations
    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort(); // Pastikan urutan mengikut nama (001, 002, etc)

    for (const file of files) {
        // 3. Semak jika migrasi sudah dijalankan
        const row = db.prepare('SELECT 1 FROM migrations WHERE name = ?').get(file);

        if (!row) {
            console.log(`Menjalankan migrasi: ${file}...`);
            const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

            try {
                db.exec(sql);
                db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
                console.log(`✅ ${file} berjaya disiapkan.`);
            } catch (err) {
                console.error(`❌ Ralat semasa menjalankan ${file}:`, err.message);
                process.exit(1); // Hentikan server jika migrasi gagal
            }
        }
    }

    console.log('--- Migrasi Selesai ---');
};

module.exports = { runMigrations };
