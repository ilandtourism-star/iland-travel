const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.resolve(__dirname, '../iland.db'));

const reviews = [
    // Kapas Snorkeling (Relax)
    {
        vacation_sku: 'relax-kapas',
        user_name: 'Ahmad Zakwan',
        rating: 5,
        comment: 'Pemandangan bawah laut yang sangat cantik! Guide pun sangat peramah dan membantu.',
        created_at: '2026-02-15 10:00:00'
    },
    {
        vacation_sku: 'relax-kapas',
        user_name: 'Siti Sarah',
        rating: 4,
        comment: 'Sangat berbaloi dengan harga. Peralatan snorkeling lengkap dan bersih.',
        created_at: '2026-02-16 14:30:00'
    },
    {
        vacation_sku: 'relax-kapas',
        user_name: 'Michael Chen',
        rating: 5,
        comment: 'Amazing experience! The turtle point was the highlight of the trip.',
        created_at: '2026-02-18 09:15:00'
    },
    // Perhentian Snorkeling
    {
        vacation_sku: 'snorkeling-perhentian',
        user_name: 'Nurul Hidayah',
        rating: 5,
        comment: 'Air yang jernih dan banyak ikan. Anak-anak sangat seronok dapat tengok nemo!',
        created_at: '2026-02-10 11:20:00'
    },
    {
        vacation_sku: 'snorkeling-perhentian',
        user_name: 'Farhan Ali',
        rating: 4,
        comment: 'Pakej yang mantap. Boat transfer on time dan tak perlu tunggu lama.',
        created_at: '2026-02-12 16:45:00'
    },
    // Private Boat Trip
    {
        vacation_sku: 'private-boat-10pax-kapas',
        user_name: 'Anis Suraya',
        rating: 5,
        comment: 'Terbaik untuk family gathering. Boat selesa dan bersih.',
        created_at: '2026-02-14 08:00:00'
    }
];

console.log('--- Memulakan Proses Seeding Ulasan ---');

const insert = db.prepare(`
    INSERT OR IGNORE INTO reviews (id, vacation_sku, user_name, rating, comment, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
`);

db.transaction(() => {
    for (const review of reviews) {
        const id = Math.random().toString(36).substr(2, 9);
        insert.run(id, review.vacation_sku, review.user_name, review.rating, review.comment, review.created_at);
    }
})();

console.log(`✅ ${reviews.length} ulasan berjaya dimasukkan.`);
console.log('--- Seeding Selesai ---');
