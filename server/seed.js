const db = require('./db');
const bcrypt = require('bcrypt');

async function seed() {
    console.log('🌱 Starting database seeding...');

    try {
        // 1. Create Users
        const passwordHash = await bcrypt.hash('password123', 10);

        // Upsert Admin
        db.prepare(`
            INSERT INTO users (username, password_hash, role)
            VALUES (?, ?, 'admin')
            ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash
        `).run('admin', passwordHash);

        console.log('✅ Admin user ready: admin / password123');

        // Upsert Partner
        db.prepare(`
            INSERT INTO users (username, password_hash, role)
            VALUES (?, ?, 'partner')
            ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash
        `).run('zul_kapas', passwordHash);

        const partner = db.prepare('SELECT id FROM users WHERE username = ?').get('zul_kapas');
        console.log(`✅ Partner user ready: zul_kapas / password123 (ID: ${partner.id})`);

        // 2. Assign all vacations to the partner
        db.prepare('UPDATE vacations SET owner_id = ?').run(partner.id);
        console.log('✅ All vacations assigned to zul_kapas');

        // 3. Generate Mock Bookings (Last 30 days)
        console.log('⏳ Generating mock bookings...');

        const vacations = db.prepare('SELECT sku, name, price, childPrice FROM vacations').all();
        const firstNames = ['Ali', 'Abu', 'Siti', 'Chong', 'Muthu', 'Sarah', 'Zul', 'Raju', 'Elena', 'Fatimah'];
        const domains = ['gmail.com', 'yahoo.com', 'icloud.com', 'outlook.com'];

        // Clear existing mock bookings if any (to avoid duplicates on multiple runs)
        // db.prepare("DELETE FROM bookings WHERE email LIKE '%@mock.com'").run();

        for (let i = 0; i < 25; i++) {
            const v = vacations[Math.floor(Math.random() * vacations.length)];
            const dateOffset = Math.floor(Math.random() * 30); // 0 to 29 days ago
            const bookingDate = new Date();
            bookingDate.setDate(bookingDate.getDate() - dateOffset);

            const adults = Math.floor(Math.random() * 4) + 1;
            const children = Math.floor(Math.random() * 3);
            const totalPrice = (adults * (v.price || 0)) + (children * (v.childPrice || 0));
            const comm = parseFloat((totalPrice * 0.10).toFixed(2));
            const net = parseFloat((totalPrice - comm).toFixed(2));

            const name = firstNames[Math.floor(Math.random() * firstNames.length)];
            const bookingId = Math.random().toString(36).substr(2, 9);

            db.prepare(`
                INSERT INTO bookings (id, firstName, email, packageName, vacation_sku, date, pax, adults, children, total_price, commission_amount, net_amount, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)
            `).run(
                bookingId,
                name,
                `${name.toLowerCase()}${i}@mock.com`,
                v.name,
                v.sku,
                bookingDate.toISOString().split('T')[0],
                adults + children,
                adults,
                children,
                totalPrice,
                comm,
                net,
                bookingDate.toISOString() // Use the same date for created_at to fill the charts
            );
        }

        console.log('✅ 25 Mock bookings generated successfully!');

        // 4. Generate Mock Reviews
        console.log('⏳ Generating mock reviews...');
        const comments = [
            'Sangat seronok! Pemandu sangat peramah.',
            'Pengalaman yang luar biasa, pasti akan datang lagi.',
            'Kawasan snorkeling sangat cantik, banyak ikan.',
            'Bot bersih dan selesa. Sangat berbaloi.',
            'Anak-anak sangat gembira, aktiviti yang sesuai untuk keluarga.',
            'Sedikit panas tapi pemandangan sangat berbaloi.',
            'Makanan tengahari yang disediakan sedap.',
            'Servis terbaik dari Iland!',
            'Pulau Kapas memang permata Terengganu.',
            'Squid jigging yang mencabar tapi fun!'
        ];

        for (let i = 0; i < 50; i++) {
            const v = vacations[Math.floor(Math.random() * vacations.length)];
            const name = firstNames[Math.floor(Math.random() * firstNames.length)];
            const rating = Math.floor(Math.random() * 2) + 4; // Mostly 4 and 5 stars
            const comment = comments[Math.floor(Math.random() * comments.length)];
            const reviewId = Math.random().toString(36).substr(2, 9);

            db.prepare(`
                INSERT INTO reviews (id, vacation_sku, user_name, rating, comment)
                VALUES (?, ?, ?, ?, ?)
            `).run(reviewId, v.sku, name, rating, comment);
        }

        console.log('✅ 50 Mock reviews generated successfully!');
        console.log('✨ Seeding complete!');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
}

seed();
