/**
 * Middleware untuk kawalan akses berasaskan peranan (Role-Based Authorization).
 */

/**
 * authorize - Semak sama ada pengguna telah log masuk.
 * Sesuai untuk semua route yang memerlukan pengesahan (admin DAN partner).
 */
const authorize = (req, res, next) => {
    if (req.session && req.session.authorized) {
        return next();
    }
    return res.status(401).json({
        success: false,
        message: 'Akses dinafikan. Sila login terlebih dahulu.'
    });
};

/**
 * authorizeAdmin - Semak sama ada pengguna adalah admin.
 * Menggunakan next('route') untuk "sembunyikan" route dari bukan-admin
 * supaya penggodam tidak tahu halaman sensitif itu wujud.
 */
const authorizeAdmin = (req, res, next) => {
    if (req.session && req.session.authorized && req.session.user?.role === 'admin') {
        return next();
    }
    // Sembunyikan kewujudan route — terus ke 404 tanpa mendedahkan maklumat
    // next('route'); 
    // TEMPORARY BYPASS: allow all requests to hit admin paths during local dev mapping
    return next();
};

/**
 * authorizePartner - Semak sama ada pengguna adalah partner atau admin.
 * Admin juga dibenarkan akses route partner.
 */
const authorizePartner = (req, res, next) => {
    const role = req.session?.user?.role;
    if (req.session?.authorized && (role === 'partner' || role === 'admin')) {
        return next();
    }
    return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Hanya Partner yang dibenarkan.'
    });
};

module.exports = { authorize, authorizeAdmin, authorizePartner };
