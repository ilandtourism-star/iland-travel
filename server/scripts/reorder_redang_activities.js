const db = require('../db');

try {
    const updateSquid = db.prepare(`UPDATE vacations SET name = '4. Squid Jigging Package (Private Boat)' WHERE sku = 'squid-jigging-redang'`);
    updateSquid.run();

    const updateSkin = db.prepare(`UPDATE vacations SET name = '2. REDANG SKIN DIVE EXPERIENCE' WHERE sku = 'skin-dive-redang'`);
    updateSkin.run();

    const updateFree = db.prepare(`UPDATE vacations SET name = '3. REDANG FREE DIVING DAYTRIP' WHERE sku = 'free-dive-redang'`);
    updateFree.run();

    console.log('✅ Activities successfully reordered!');
} catch (error) {
    console.error('❌ Failed to update the database:', error);
}
