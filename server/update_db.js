const db = require('./db');

// Contoh: Ubah harga pakej 'relax-kapas'
const skuToUpdate = 'relax-kapas';
const newPrice = 55.00; // Harga baru

console.log(`--- Updating Price for ${skuToUpdate} to RM${newPrice} ---\n`);

try {
    // 1. Check old price
    const item = db.prepare('SELECT * FROM vacations WHERE sku = ?').get(skuToUpdate);
    console.log('Old Data:', item);

    // 2. Perform Update
    const update = db.prepare('UPDATE vacations SET price = ? WHERE sku = ?');
    const info = update.run(newPrice, skuToUpdate);

    if (info.changes > 0) {
        console.log(`\n✅ Success! ${info.changes} row(s) updated.`);

        // 3. Verify new price
        const newItem = db.prepare('SELECT * FROM vacations WHERE sku = ?').get(skuToUpdate);
        console.log('New Data:', newItem);
    } else {
        console.log('\n❌ Failed: SKU not found.');
    }

} catch (err) {
    console.error('Error updating data:', err.message);
}
