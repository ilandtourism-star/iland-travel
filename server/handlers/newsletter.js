const db = require('../db');
const { seasonListenerSchema } = require('../lib/schemas');

/**
 * Endpoint untuk pendaftaran notifikasi "In Season".
 * Digunakan apabila aktiviti berada di luar musim.
 */
/**
 * Endpoint untuk pendaftaran notifikasi "In Season".
 * Digunakan apabila aktiviti berada di luar musim.
 */
exports.addSeasonListenerApi = async (req, res) => {
    // Memulakan validasi menggunakan Zod
    const validation = seasonListenerSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.errors[0].message
        });
    }

    const { email, sku } = validation.data;

    // Menggunakan Abstraksi Database (DAL) dengan gaya Idempotent (INSERT OR IGNORE)
    const result = db.addSeasonListener(email, sku);

    if (result.changes > 0) {
        res.status(201).json({
            success: true,
            message: 'Berjaya! Kami akan hantarkan emel apabila aktiviti ini kembali dibuka.'
        });
    } else {
        res.status(200).json({
            success: true,
            message: 'Anda sudah didaftarkan untuk aktiviti ini. Kami akan maklumkan nanti!'
        });
    }
};
