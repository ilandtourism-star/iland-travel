const db = require('../db');

try {
    const update = db.prepare(`
        UPDATE vacations 
        SET image_url = '/images/Redang island/redang_snorkeling_all_in.png'
        WHERE sku = 'snorkeling-redang'
    `);
    
    const info = update.run();
    console.log(`✅ Snorkeling Redang image updated successfully! Rows changed: ${info.changes}`);
} catch (error) {
    console.error('❌ Failed to update the database:', error);
}
