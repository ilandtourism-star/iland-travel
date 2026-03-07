const db = require('../db');
const { bookingSchema, skuSchema, dateSchema, idSchema, emailSchema } = require('../lib/schemas');

// Helper to generate simple ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Simulation helper for email notifications
const sendSimulatedEmail = (booking) => {
    console.log('--------------------------------------------------');
    console.log('📧 SIMULATED EMAIL SENT');
    console.log(`To: ${booking.email}`);
    console.log(`Subject: Booking Confirmation - ${booking.packageName}`);
    console.log(`Body: Hello ${booking.firstName}, your booking (ID: ${booking.id}) for ${booking.packageName} on ${booking.date} has been confirmed. Total Paid: RM ${booking.total_price}`);
    console.log('--------------------------------------------------');
};

const sendReviewReminderEmail = (booking) => {
    console.log('--------------------------------------------------');
    console.log('📧 SIMULATED EMAIL SENT (Post-Activity)');
    console.log(`To: ${booking.email}`);
    console.log(`Subject: How was your trip to ${booking.packageName}?`);
    console.log(`Body: Hello ${booking.firstName}, we hope you enjoyed your activity! Please leave a review at: http://localhost:5175/activity-details-link`);
    console.log('--------------------------------------------------');
};

const mapPublicInvoice = (b) => ({
    id: b.id,
    firstName: b.firstName,
    email: b.email,
    packageName: b.packageName,
    date: b.date,
    pax: b.pax,
    adults: b.adults,
    children: b.children,
    totalPrice: (b.total_price / 100).toFixed(2),
    status: b.status
});

const mapBooking = (b) => ({
    id: b.id,
    firstName: b.firstName,
    email: b.email,
    packageName: b.packageName,
    date: b.date,
    pax: b.pax,
    adults: b.adults,
    children: b.children,
    totalPrice: (b.total_price / 100).toFixed(2),
    status: b.status,
    created_at: b.created_at
});

// =============================================
// PUBLIC API (Booking Flow)
// =============================================

const addBookingApi = (req, res) => {
    // Memulakan validasi menggunakan Zod
    const validation = bookingSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.errors[0].message
        });
    }

    const bookingData = validation.data;

    const adultsCount = parseInt(bookingData.adults || 1);
    const childrenCount = parseInt(bookingData.children || 0);

    const newBooking = {
        id: generateId(),
        firstName: bookingData.firstName,
        email: bookingData.email,
        packageName: bookingData.packageName,
        vacation_sku: bookingData.vacation_sku || null,
        date: bookingData.date ? new Date(bookingData.date).toISOString().split('T')[0] : null,
        pax: bookingData.pax || (adultsCount + childrenCount),
        adults: adultsCount,
        children: childrenCount,
        total_price: 0,
        commission_amount: 0,
        net_amount: 0,
        status: 'confirmed'
    };

    // --- Price & Availability Logic ---
    if (newBooking.vacation_sku) {
        // 1. Get Vacation Price & Max Pax
        const vacation = db.prepare('SELECT price, childPrice, max_pax FROM vacations WHERE sku = ?').get(newBooking.vacation_sku);

        if (vacation) {
            // Calculate Total Price (Integer Math in Sen)
            newBooking.total_price = (adultsCount * (vacation.price || 0)) + (childrenCount * (vacation.childPrice || 0));

            // Professional Commission Calculation (10%) using Integers
            const commissionRate = 0.10;
            newBooking.commission_amount = Math.round(newBooking.total_price * commissionRate);
            newBooking.net_amount = newBooking.total_price - newBooking.commission_amount;

            if (newBooking.date) {
                const maxPax = vacation.max_pax || 12;

                // 2. Check/Initialize Availability
                let dayAvail = db.prepare('SELECT remaining_pax FROM availability WHERE vacation_sku = ? AND date = ?').get(newBooking.vacation_sku, newBooking.date);

                if (!dayAvail) {
                    db.prepare('INSERT INTO availability (vacation_sku, date, remaining_pax) VALUES (?, ?, ?)').run(newBooking.vacation_sku, newBooking.date, maxPax);
                    dayAvail = { remaining_pax: maxPax };
                }

                // 3. Check if enough slots
                if (dayAvail.remaining_pax < newBooking.pax) {
                    return res.status(400).json({
                        success: false,
                        message: `Maaf, hanya tinggal ${dayAvail.remaining_pax} slot kosong untuk tarikh ini.`
                    });
                }

                // 4. Deduct slots
                db.prepare('UPDATE availability SET remaining_pax = remaining_pax - ? WHERE vacation_sku = ? AND date = ?').run(newBooking.pax, newBooking.vacation_sku, newBooking.date);
            }
        }
    }
    // --- End Logic ---

    const insert = db.prepare(`
        INSERT INTO bookings (id, firstName, email, packageName, vacation_sku, date, pax, adults, children, total_price, commission_amount, net_amount, status)
        VALUES (@id, @firstName, @email, @packageName, @vacation_sku, @date, @pax, @adults, @children, @total_price, @commission_amount, @net_amount, @status)
    `);
    console.log('Inserting new booking:', JSON.stringify(newBooking, null, 2));
    insert.run(newBooking);

    sendSimulatedEmail(newBooking);
    console.log('New Booking Verified & Saved:', newBooking.id);

    // Simulate sending a review reminder after 1 second (in real life it would be days later)
    setTimeout(() => {
        sendReviewReminderEmail(newBooking);
    }, 1000);

    res.status(201).json({
        success: true,
        message: 'Tempahan berjaya disahkan!',
        booking: newBooking,
        invoiceUrl: `/invoice/${newBooking.id}`
    });
};

const checkAvailabilityApi = (req, res) => {
    const { sku, date } = req.params;

    // Validate Params
    const skuVal = skuSchema.safeParse(sku);
    const dateVal = dateSchema.safeParse(date);
    if (!skuVal.success) return res.status(400).json({ success: false, message: skuVal.error.errors[0].message });
    if (!dateVal.success) return res.status(400).json({ success: false, message: dateVal.error.errors[0].message });

    // 1. Get current remaining pax
    const dayAvail = db.prepare('SELECT remaining_pax FROM availability WHERE vacation_sku = ? AND date = ?').get(sku, date);

    if (dayAvail) {
        return res.json({ success: true, remaining_pax: dayAvail.remaining_pax });
    }

    // 2. If not found, get max_pax from vacations
    const vacation = db.prepare('SELECT max_pax FROM vacations WHERE sku = ?').get(sku);
    const maxPax = vacation ? vacation.max_pax : 12;

    res.json({ success: true, remaining_pax: maxPax });
}

const getInvoiceApi = (req, res) => {
    const { id } = req.params;

    // Validate ID
    const idVal = idSchema.safeParse(id);
    if (!idVal.success) return res.status(400).json({ success: false, message: "ID Resit tidak sah." });

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id);

    if (booking) {
        res.json({ success: true, booking: mapPublicInvoice(booking) });
    } else {
        res.status(404).json({ success: false, message: 'Resit tidak dijumpai.' });
    }
};

const lookupBookingApi = (req, res) => {
    const { id, email } = req.query;

    if (id) {
        if (!idSchema.safeParse(id).success) return res.status(400).json({ success: false, message: "Format ID tidak sah." });
    }
    if (email) {
        if (!emailSchema.safeParse(email).success) return res.status(400).json({ success: false, message: "Format emel tidak sah." });
    }

    if (!id && !email) {
        return res.status(400).json({
            success: false,
            message: 'Sila masukkan ID Tempahan atau emel anda.'
        });
    }

    let bookings = [];

    if (id) {
        const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(id.trim());
        if (booking) bookings = [booking];
    } else if (email) {
        bookings = db.prepare('SELECT * FROM bookings WHERE LOWER(email) = ?').all(email.trim().toLowerCase());
    }

    if (bookings.length === 0) {
        return res.status(404).json({
            success: false,
            message: 'Tiada tempahan dijumpai. Sila semak ID atau emel anda.'
        });
    }

    const mapped = bookings.map(b => ({
        id: b.id,
        packageName: b.package_name,
        date: b.date,
        pax: b.pax,
        adults: b.adults,
        children: b.children,
        totalPrice: (b.total_price / 100).toFixed(2),
        status: b.status || 'confirmed',
        email: b.email,
        firstName: b.first_name,
    }));

    res.json({ success: true, bookings: mapped });
}

// =============================================
// ADMIN / PARTNER API (Management)
// =============================================

const getBookingsApi = (req, res) => {
    const stmt = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC');
    const bookings = stmt.all();
    res.json(bookings.map(mapBooking));
};

const updateAvailabilityApi = (req, res) => {
    const { sku, date } = req.params;

    // Validate Params
    const skuVal = skuSchema.safeParse(sku);
    const dateVal = dateSchema.safeParse(date);
    if (!skuVal.success) return res.status(400).json({ success: false, message: skuVal.error.errors[0].message });
    if (!dateVal.success) return res.status(400).json({ success: false, message: dateVal.error.errors[0].message });
    const { remaining_pax } = req.body;

    if (remaining_pax === undefined || remaining_pax === null) {
        return res.status(400).json({ message: 'Jumlah slot tidak sah.' });
    }

    // Check if record exists
    const dayAvail = db.prepare('SELECT 1 FROM availability WHERE vacation_sku = ? AND date = ?').get(sku, date);

    let result;
    if (dayAvail) {
        result = db.prepare('UPDATE availability SET remaining_pax = ? WHERE vacation_sku = ? AND date = ?')
            .run(remaining_pax, sku, date);
    } else {
        result = db.prepare('INSERT INTO availability (vacation_sku, date, remaining_pax) VALUES (?, ?, ?)')
            .run(sku, date, remaining_pax);
    }

    if (result.changes > 0) {
        res.json({ success: true, message: 'Ketersediaan berjaya dikemaskini.' });
    } else {
        res.status(500).json({ success: false, message: 'Gagal mengemaskini ketersediaan.' });
    }
}

module.exports = {
    addBookingApi,
    getBookingsApi,
    checkAvailabilityApi,
    updateAvailabilityApi,
    getInvoiceApi,
    lookupBookingApi
};
