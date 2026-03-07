const db = require('./db');

console.log('--- Reading Database: iland.db ---\n');

// 1. Read Users
try {
    const users = db.prepare('SELECT id, username, role, created_at FROM users').all();
    console.log(`[Users Table] (${users.length} rows)`);
    console.table(users);
} catch (err) {
    console.error('Error reading users:', err.message);
}

console.log('\n');

// 2. Read Bookings
try {
    const bookings = db.prepare('SELECT * FROM bookings').all();
    console.log(`[Bookings Table] (${bookings.length} rows)`);
    console.table(bookings);
} catch (err) {
    console.error('Error reading bookings:', err.message);
}

console.log('\n');

// 3. Read Vacations (Limit 5)
try {
    const vacations = db.prepare('SELECT sku, name, price FROM vacations LIMIT 5').all();
    console.log(`[Vacations Table] (Showing first ${vacations.length} rows)`);
    console.table(vacations);
} catch (err) {
    console.error('Error reading vacations:', err.message);
}
