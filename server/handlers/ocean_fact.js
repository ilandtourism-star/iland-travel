const db = require('../db');

/**
 * Handler untuk mendapatkan ocean fact secara rawak atau yang terbaru.
 */
exports.getRandomOceanFactApi = (req, res) => {
    try {
        const stmt = db.prepare('SELECT fact FROM ocean_facts WHERE is_active = 1 ORDER BY RANDOM() LIMIT 1');
        const row = stmt.get();

        if (!row) {
            return res.json({
                success: true,
                fact: "The ocean is a mysterious and beautiful place."
            });
        }

        res.json({
            success: true,
            fact: row.fact
        });
    } catch (err) {
        console.error('Error fetching ocean fact:', err);
        res.status(500).json({
            success: false,
            message: 'Gagal mendapatkan fakta lautan.'
        });
    }
};
