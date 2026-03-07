const db = require('../db');
const { keySchema } = require('../lib/schemas');

const getSettingsApi = (req, res) => {
    const { key } = req.params;

    // Validate Key
    const validation = keySchema.safeParse(key);
    if (!validation.success) return res.status(400).json({ message: validation.error.errors[0].message });

    const stmt = db.prepare('SELECT value FROM settings WHERE key = ?');
    const setting = stmt.get(key);
    if (setting) {
        res.json({ success: true, value: JSON.parse(setting.value) });
    } else {
        res.status(404).json({ message: 'Setting tidak ditemui.' });
    }
};

const updateSettingsApi = (req, res) => {
    const { key } = req.params;
    const { value } = req.body;

    // Validate Key
    const validation = keySchema.safeParse(key);
    if (!validation.success) return res.status(400).json({ message: validation.error.errors[0].message });

    // Ensure value is provided
    if (value === undefined) {
        return res.status(400).json({ message: 'Nilai settings diperlukan.' });
    }

    const stmt = db.prepare('UPDATE settings SET value = ? WHERE key = ?');
    const info = stmt.run(JSON.stringify(value), key);

    if (info.changes > 0) {
        res.json({ success: true, message: 'Tetapan berjaya dikemaskini.' });
    } else {
        res.status(404).json({ message: 'Setting tidak ditemui.' });
    }
};

module.exports = {
    getSettingsApi,
    updateSettingsApi
};
