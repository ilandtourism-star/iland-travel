const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const { skuSchema } = require('../lib/schemas');

// Pastikan folder uploads wujud
const uploadDir = path.join(__dirname, '..', 'uploads', 'photos');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi penyimpanan fail
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `photo-${uniqueSuffix}${ext}`);
    }
});

// Penapis fail — hanya terima gambar
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Hanya fail gambar (JPEG, PNG, WebP) dibenarkan.'), false);
    }
};

// Multer middleware — had 5MB per gambar
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Middleware untuk satu gambar
exports.uploadMiddleware = upload.single('photo');

// Handler: Muat naik gambar aktiviti
exports.uploadPhotoApi = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Tiada fail gambar dipilih.' });
    }

    const sku = req.params.sku;

    const keyVal = skuSchema.safeParse(sku);
    if (!keyVal.success) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, message: keyVal.error.errors[0].message });
    }
    const userId = req.session.user?.id;
    const imageUrl = `/uploads/photos/${req.file.filename}`;

    // Semak sama ada SKU aktiviti dimiliki oleh partner ini
    // Semak dahulu jika aktiviti wujud
    let vacation = db.prepare('SELECT * FROM vacations WHERE sku = ?').get(sku);

    if (!vacation) {
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ success: false, message: 'Aktiviti tidak dijumpai.' });
    }

    // DEBUG: Jika aktiviti tiada owner (seeded data), berikan kepada user ini (Auto-Claim)
    if (vacation.owner_id === null || vacation.owner_id === undefined) {
        console.log(`[Auto-Claim] Memberikan hak milik ${sku} kepada User ID: ${userId}`);
        db.prepare('UPDATE vacations SET owner_id = ? WHERE sku = ?').run(userId, sku);
        vacation.owner_id = userId; // Update local obj
    }

    // Semak pemilikan (Admin dibenarkan akses semua)
    const userRole = req.session.user?.role;
    if (vacation.owner_id !== userId && userRole !== 'admin') {
        fs.unlinkSync(req.file.path);
        return res.status(403).json({ success: false, message: 'Anda tidak mempunyai akses ke aktiviti ini.' });
    }

    // Kemaskini URL gambar dalam pangkalan data
    db.prepare('UPDATE vacations SET image = ? WHERE sku = ?').run(imageUrl, sku);

    res.json({
        success: true,
        message: 'Gambar berjaya dimuat naik!',
        imageUrl
    });
};

// Handler: Dapatkan semua gambar aktiviti partner
exports.getPhotosApi = (req, res) => {
    const userId = req.session.user?.id;
    const activities = db.prepare('SELECT sku, name, image FROM vacations WHERE owner_id = ?').all(userId);

    const photos = activities
        .filter(a => a.image)
        .map(a => ({
            sku: a.sku,
            activityName: a.name,
            imageUrl: a.image
        }));

    res.json({ success: true, photos });
};
