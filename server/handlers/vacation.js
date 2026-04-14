const db = require('../db');
const { skuSchema, vacationSchema, islandSchema, categorySchema } = require('../lib/schemas');

// --- Seed Initial Data if Empty ---
const seedVacations = () => {
    // Check if we already have fully seeded data (with image_url)
    const check = db.prepare("SELECT count(*) as count FROM vacations WHERE sku = 'private-boat-10pax-kapas'").get();

    // We update/seed if features are missing or table is empty
    if (check.count === 0) {
        console.log('Seeding/Updating vacations data with full details and original images...');
        const initialData = [
            {
                sku: 'relax-kapas',
                name: '1. Relaxation (island hopping only)',
                description: '',
                price: 4900,
                childPrice: 3900,
                island: 'Kapas',
                category: 'snorkeling',
                is_in_season: 1,
                imageUrl: '/images/kapas island/1. Relaxation Package/1.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "BOAT TRANSFER" },
                    { icon: "fas fa-vest", text: "LIFE JACKET" },
                    { icon: "fas fa-umbrella-beach", text: "FREE DAN EASY" }
                ])
            },
            {
                sku: 'mental-escape-kapas',
                name: '2. Mental Escape',
                description: '',
                price: 5900,
                island: 'Kapas',
                category: 'snorkeling',
                is_in_season: 1,
                imageUrl: '/images/kapas island/2. Mental Escape/1.png',
                features: JSON.stringify([
                    { icon: "fas fa-mask", text: "Snorkeling Gear" },
                    { icon: "fas fa-ship", text: "Boat Transfer" },
                    { icon: "fas fa-vest", text: "LIFE JACKET (FULL DAY)" }
                ])
            },
            {
                sku: 'joy-play-kapas',
                name: '3. Joy & Playfulness',
                description: '',
                price: 6900,
                childPrice: 5900,
                island: 'Kapas',
                category: 'snorkeling',
                is_in_season: 1,
                imageUrl: '/images/kapas island/3. Joy & Playfulness (Top Pick!)/2.png',
                features: JSON.stringify([
                    { icon: "fas fa-fish", text: "Marine Park Trip" },
                    { icon: "fas fa-vest", text: "LIFE JACKET (FULL DAY)" },
                    { icon: "fas fa-mask", text: "SNORKELING EQUIPMENT (FULL DAY)" },
                    { icon: "fas fa-ship", text: "BOAT TRANSFER" }
                ])
            },
            {
                sku: 'mood-booster-kapas',
                name: '4. Mood Booster',
                description: '',
                price: 10900,
                childPrice: 9900,
                island: 'Kapas',
                category: 'snorkeling',
                is_in_season: 1,
                imageUrl: '/images/kapas island/4. Mood Booster/6.png',
                features: JSON.stringify([
                    { icon: "fas fa-map-marked-alt", text: "ISLAND TOUR" },
                    { icon: "fas fa-hiking", text: "HIKING BUKIT SINGA" },
                    { icon: "fas fa-fish", text: "TRIP MARINE PARK POINT" },
                    { icon: "fas fa-mask", text: "SNORKELING EQUIPMENT (FULL DAY)" },
                    { icon: "fas fa-vest", text: "LIFE JACKET (FULL DAY)" },
                    { icon: "fas fa-ship", text: "BOAT TRANSFER" }
                ])
            },
            {
                sku: 'private-boat-10pax-kapas',
                name: '5. Private Boat Trip (max 10pax)',
                description: '',
                price: 85000,
                island: 'Kapas',
                category: 'boat_trip_family',
                is_in_season: 1,
                imageUrl: '/images/Private Boat Trip/21.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "PRIVATE BOAT TRANSFER" },
                    { icon: "fas fa-mask", text: "SNORKELING EQUIPMENT FULLDAY" },
                    { icon: "fas fa-vest", text: "LIFE JACKET FULLDAY" }
                ])
            },
            {
                sku: 'private-boat-15pax-kapas',
                name: '6. Private Boat Trip (max 15pax)',
                description: '',
                price: 105000,
                island: 'Kapas',
                category: 'boat_trip_family',
                is_in_season: 1,
                imageUrl: '/images/Private Boat Trip/21.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "PRIVATE BOAT TRANSFER" },
                    { icon: "fas fa-mask", text: "SNORKELING EQUIPMENT FULLDAY" },
                    { icon: "fas fa-vest", text: "LIFE JACKET FULLDAY" }
                ])
            },
            {
                sku: 'private-boat-25pax-kapas',
                name: '7. Private Boat Trip (max 25pax)',
                description: '',
                price: 175000,
                island: 'Kapas',
                category: 'boat_trip_family',
                is_in_season: 1,
                imageUrl: '/images/Private Boat Trip/21.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "PRIVATE BOAT TRANSFER" },
                    { icon: "fas fa-mask", text: "SNORKELING EQUIPMENT FULLDAY" },
                    { icon: "fas fa-vest", text: "LIFE JACKET FULLDAY" }
                ])
            },
            {
                sku: 'private-boat-40pax-kapas',
                name: '8. Private Boat Trip (max 40pax)',
                description: '',
                price: 280000,
                island: 'Kapas',
                category: 'boat_trip_family',
                is_in_season: 1,
                imageUrl: '/images/Private Boat Trip/21.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "PRIVATE BOAT TRANSFER" },
                    { icon: "fas fa-mask", text: "SNORKELING EQUIPMENT FULLDAY" },
                    { icon: "fas fa-vest", text: "LIFE JACKET FULLDAY" }
                ])
            },
            {
                sku: 'private-package-10pax-kapas',
                name: '9. Private Boat Package (max 10pax)',
                description: '',
                price: 140000,
                island: 'Kapas',
                category: 'boat_trip_exclusive',
                is_in_season: 1,
                imageUrl: '/images/Private Boat Package/makan.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "PRIVATE BOAT TRANSFER" },
                    { icon: "fas fa-swimmer", text: "ALL ACTIVITIES & EQUIPMENT" },
                    { icon: "fas fa-glass-cheers", text: "UNLIMITED COLD DRINK" },
                    { icon: "fas fa-utensils", text: "FREE MEALS" },
                    { icon: "fas fa-map-marker-alt", text: "MORE THAN 1 SNORKELING POINTS" }
                ])
            },
            {
                sku: 'private-package-15pax-kapas',
                name: '10. Private Boat Package (max 15pax)',
                description: '',
                price: 180000,
                island: 'Kapas',
                category: 'boat_trip_exclusive',
                is_in_season: 1,
                imageUrl: '/images/Private Boat Package/makan.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "PRIVATE BOAT TRANSFER" },
                    { icon: "fas fa-swimmer", text: "ALL ACTIVITIES & EQUIPMENT" },
                    { icon: "fas fa-glass-cheers", text: "UNLIMITED COLD DRINK" },
                    { icon: "fas fa-utensils", text: "FREE MEALS" },
                    { icon: "fas fa-map-marker-alt", text: "MORE THAN 1 SNORKELING POINTS" }
                ])
            },
            {
                sku: 'private-package-25pax-kapas',
                name: '11. Private Boat Package (max 25pax)',
                description: '',
                price: 300000,
                island: 'Kapas',
                category: 'boat_trip_exclusive',
                is_in_season: 1,
                imageUrl: '/images/Private Boat Package/makan.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "PRIVATE BOAT TRANSFER" },
                    { icon: "fas fa-swimmer", text: "ALL ACTIVITIES & EQUIPMENT" },
                    { icon: "fas fa-glass-cheers", text: "UNLIMITED COLD DRINK" },
                    { icon: "fas fa-utensils", text: "FREE MEALS" },
                    { icon: "fas fa-map-marker-alt", text: "MORE THAN 1 SNORKELING POINTS" }
                ])
            },
            {
                sku: 'private-package-40pax-kapas',
                name: '12. Private Boat Package (max 40pax)',
                description: '',
                price: 440000,
                island: 'Kapas',
                category: 'boat_trip_exclusive',
                is_in_season: 1,
                imageUrl: '/images/Private Boat Package/makan.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "PRIVATE BOAT TRANSFER" },
                    { icon: "fas fa-swimmer", text: "ALL ACTIVITIES & EQUIPMENT" },
                    { icon: "fas fa-glass-cheers", text: "UNLIMITED COLD DRINK" },
                    { icon: "fas fa-utensils", text: "FREE MEALS" },
                    { icon: "fas fa-map-marker-alt", text: "MORE THAN 1 SNORKELING POINTS" }
                ])
            },
            {
                sku: 'snorkeling-redang',
                name: '1. Day Trip Snorkeling (All-In)',
                description: ' Spots: LITTLE MALDIVES - PULAU PAKU - TELUK KURMA - EKOR TEBU - FISH POINT - TURTLE POINT',
                price: 12000,
                childPrice: 10000,
                island: 'Redang',
                category: 'snorkeling',
                is_in_season: 1,
                imageUrl: '/images/Redang island/2.jpg',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "BOAT 2 WAYS" },
                    { icon: "fas fa-mask", text: "SNORKELING EQUIPMENT" },
                    { icon: "fas fa-vest", text: "LIFE JACKET" },
                    { icon: "fas fa-utensils", text: "LUNCH PACK" },
                    { icon: "fas fa-glass-cheers", text: "UNLIMITED DRINKS" },
                    { icon: "fas fa-map-marker-alt", text: "5/6 SNORKELING SPOTS" },
                    { icon: "fas fa-fish", text: "FREE FEEDING FISH" },
                    { icon: "fas fa-paw", text: "FREE FEEDING TURTLE" },
                    { icon: "fas fa-user-tie", text: "EXPERIENCED GUIDE" },
                    { icon: "fas fa-file-contract", text: "BOAT INSURANCE" }
                ])
            },
            {
                sku: 'squid-jigging-redang',
                name: '2. Squid Jigging Package (Private Boat)',
                description: '',
                price: 135000,
                island: 'Redang',
                category: 'squid_jigging',
                is_in_season: 1,
                imageUrl: '/images/Redang island/snorkeling2.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "PRIVATE BOAT" },
                    { icon: "fas fa-anchor", text: "SQUID JIGGING EQUIPMENT" }
                ])
            },
            {
                sku: 'snorkeling-perhentian',
                name: '1. Day Trip Snorkeling',
                description: 'Spots: TELUK KEKE/TIGA RUANG - FISH POINT/CORAL GARDEN - SHARK POINT - TURTLE POINT - LATA AIR BERANI - KAMPUNG NELAYAN',
                price: 10000,
                childPrice: 7000,
                island: 'Perhentian',
                category: 'snorkeling',
                is_in_season: 1,
                imageUrl: '/images/perhentian island/1.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "2 WAYS BOAT TRANSFER" },
                    { icon: "fas fa-mask", text: "FULLSET SNORKLING EQUIPMENT" },
                    { icon: "fas fa-vest", text: "LIFE JACKET, MASK, GOOGLE" },
                    { icon: "fas fa-user-tie", text: "SNORKLING GUIDE TO ALL POINTS" },
                    { icon: "fas fa-fish", text: "SNORKLING TRIP 5/6 POINTS" }
                ])
            },
            {
                sku: 'skin-dive-perhentian',
                name: '2. LEARN SKINDIVING',
                description: 'Your first step into freediving. 1.5 Hours Learning Session. Suitable for beginner to intermediate snorkelers.',
                price: 26000,
                childPrice: null,
                island: 'Perhentian',
                category: 'snorkeling',
                is_in_season: 1,
                imageUrl: '/images/perhentian island/learn_skindiving.png',
                features: JSON.stringify([
                    { icon: "fas fa-clock", text: "1.5 Hours Learning Session" },
                    { icon: "fas fa-ship", text: "Return Boat Transfer (KB Jetty - Perhentian)" },
                    { icon: "fas fa-water", text: "Guided shallow dive (5-10m)" },
                    { icon: "fas fa-lungs", text: "Proper breathing & relaxations" },
                    { icon: "fas fa-swimmer", text: "Duck dive & equalization basics" }
                ])
            },
            {
                sku: 'skin-dive-experience-perhentian',
                name: '3. PERHENTIAN SKIN DIVE EXPERIENCE',
                description: '"Too deep for snorkelers, too light for freedivers perfect for those who prefer a light and relaxing dive." Spots: Tiga Ruang (Warm up), Turtle Point, Nemo Point (Nemo & Cave), Coral Garden (Depth training), Shark Point (Cave).',
                price: 27000,
                childPrice: null,
                island: 'Perhentian',
                category: 'snorkeling',
                is_in_season: 1,
                imageUrl: '/images/perhentian island/perhentian_skin_dive.png',
                features: JSON.stringify([
                    { icon: "fas fa-ship", text: "Return boat transfer" },
                    { icon: "fas fa-user-shield", text: "Guide / Safety Supervision" },
                    { icon: "fas fa-chalkboard-teacher", text: "Basic Skin Dive Coaching" },
                    { icon: "fas fa-video", text: "Underwater Footage (Personal Video)" },
                    { icon: "fas fa-id-card", text: "Marine Park Fee included" },
                    { icon: "fas fa-exclamation-triangle", text: "Bring your own mask/snorkel/fins (Weight & lunch not info/provided)" }
                ])
            },
            {
                sku: 'free-dive-perhentian',
                name: '5. PERHENTIAN FREE DIVING DAYTRIP',
                description: 'Resort (Island), Perhentian Dive Site. Diving Points: Underwater cave (5 Meter), Police wreck (18 Meter), Underwater Corridor (5 Meter), Shark point (5 Meter). Terms & conditions: No freediving license required, participants must be able to swim & follow instructions.',
                price: 28000,
                childPrice: null,
                island: 'Perhentian',
                category: 'snorkeling',
                is_in_season: 1,
                imageUrl: '/images/perhentian island/perhentian_freediving.png',
                features: JSON.stringify([
                    { icon: "fas fa-clock", text: "1 hour dive for each point" },
                    { icon: "fas fa-ship", text: "Return boat included" },
                    { icon: "fas fa-id-card", text: "Marine park fees included" },
                    { icon: "fas fa-bottle-water", text: "Free flow mineral water" },
                    { icon: "fas fa-video", text: "Underwater footage & picture" },
                    { icon: "fas fa-plus-circle", text: "Add on: Lunch (RM35), Drone (RM180/pax), Safety buddies (RM50)" }
                ])
            }
        ];

        const insert = db.prepare(`
            INSERT INTO vacations (sku, name, description, price, childPrice, island, category, is_in_season, features, image_url) 
            VALUES (@sku, @name, @description, @price, @childPrice, @island, @category, @is_in_season, @features, @imageUrl)
            ON CONFLICT(sku) DO UPDATE SET
                name = excluded.name,
                price = excluded.price,
                childPrice = excluded.childPrice,
                island = excluded.island,
                category = excluded.category,
                is_in_season = excluded.is_in_season,
                features = excluded.features,
                description = excluded.description,
                image_url = excluded.image_url
        `);
        const insertMany = db.transaction((vacations) => {
            for (const v of vacations) {
                if (v.childPrice === undefined) v.childPrice = null;
                insert.run(v);
            }
        });
        insertMany(initialData);
        console.log('Vacations seeded/updated with full details and original images.');
    }
};

exports.seedVacations = seedVacations;

// Helper untuk memformat data percutian sebelum dihantar ke View
const mapVacation = (v) => {
    const priceInRM = v.price / 100;
    const childPriceInRM = v.childPrice ? v.childPrice / 100 : null;

    return {
        sku: v.sku,
        name: v.name,
        description: v.description,
        price: priceInRM, // Convert sen to RM for frontend consumption
        childPrice: childPriceInRM,
        displayPrice: `RM ${priceInRM.toFixed(2)}`,
        displayChildPrice: childPriceInRM ? `RM ${childPriceInRM.toFixed(2)}` : null,
        maxPax: v.max_pax,
        island: v.island,
        category: v.category,
        imageUrl: v.image_url,
        features: v.features ? JSON.parse(v.features) : [],
        rating: v.avg_rating ? parseFloat(v.avg_rating).toFixed(1) : "0.0",
        reviewCount: v.review_count || 0,
        isInSeason: v.is_in_season === 1 // Convert to Boolean
    };
};

// =============================================
// PUBLIC API (Read-Only)
// =============================================

// Ambil percutian dengan pilihan filter dan statistik review
exports.getVacationsApi = async (req, res) => {
    const { island, category } = req.query;

    // Validate Query Params
    const islandVal = islandSchema.safeParse(island);
    const categoryVal = categorySchema.safeParse(category);

    if (!islandVal.success) return res.status(400).json({ message: "Format pulau tidak sah." });
    if (!categoryVal.success) return res.status(400).json({ message: "Format kategori tidak sah." });

    // Menggunakan Abstraksi Database (DAL)
    const vacations = db.getVacations({ island, category });
    res.json(vacations.map(mapVacation));
}

// Ambil satu percutian mengikut SKU
exports.getVacationBySkuApi = async (req, res) => {
    // Validate SKU
    const validation = skuSchema.safeParse(req.params.sku);
    if (!validation.success) return res.status(400).json({ message: validation.error.errors[0].message });

    // Menggunakan Abstraksi Database (DAL)
    const vacation = db.getVacations({ sku: req.params.sku });

    if (vacation) {
        res.json(mapVacation(vacation));
    } else {
        res.status(404).json({ message: 'Tidak ditemui' });
    }
}

// =============================================
// ADMIN / PARTNER API (Write Access)
// =============================================

// Tambah percutian baru
exports.addVacationApi = async (req, res) => {
    // Validate Body
    const validation = vacationSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
    }
    const vacation = validation.data;

    // Ensure childPrice is null if not provided (Zod optional/nullable handling)
    if (vacation.childPrice === undefined) vacation.childPrice = null;

    try {
        const insert = db.prepare('INSERT INTO vacations (sku, name, description, price, childPrice) VALUES (@sku, @name, @description, @price, @childPrice)');
        insert.run(vacation);
        res.status(201).json({ message: 'Percutian berjaya ditambah', vacation });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
            return res.status(400).json({ message: 'SKU sudah wujud.' });
        }
        throw error; // Rethrow other errors to be handled by global error handler
    }
}

// Kemaskini percutian sedia ada
exports.updateVacationApi = async (req, res) => {
    const sku = req.params.sku;
    // Validate SKU
    const validation = skuSchema.safeParse(sku);
    if (!validation.success) return res.status(400).json({ message: validation.error.errors[0].message });

    const updates = req.body;

    // Validate Body (Partial)
    const bodyValidation = vacationSchema.partial().safeParse(updates);
    if (!bodyValidation.success) {
        return res.status(400).json({ message: bodyValidation.error.errors[0].message });
    }
    // Use validated data
    const validUpdates = bodyValidation.data;

    // Construct dynamic UPDATE query
    const keys = Object.keys(validUpdates).filter(k => k !== 'sku'); // Don't update SKU
    if (keys.length === 0) return res.json({ message: 'Tiada perubahan' });

    const setClause = keys.map(k => `${k} = ?`).join(', ');
    const values = [...keys.map(k => validUpdates[k]), sku];

    const stmt = db.prepare(`UPDATE vacations SET ${setClause} WHERE sku = ?`);
    const info = stmt.run(...values);

    if (info.changes > 0) {
        const updated = db.prepare('SELECT * FROM vacations WHERE sku = ?').get(sku);
        res.json({ message: 'Berjaya dikemaskini', vacation: updated });
    } else {
        res.status(404).json({ message: 'Tidak ditemui' });
    }
}

// Padam percutian berdasarkan SKU
exports.requestDeleteVacationApi = async (req, res) => {
    const sku = req.params.sku;
    // Validate SKU
    const validation = skuSchema.safeParse(sku);
    if (!validation.success) return res.status(400).json({ message: validation.error.errors[0].message });

    const stmt = db.prepare('DELETE FROM vacations WHERE sku = ?');
    const info = stmt.run(sku);
    if (info.changes > 0) {
        res.json({ success: true, message: 'Berjaya dipadam' });
    } else {
        res.status(404).json({ success: false, message: 'Tidak ditemui' });
    }
}

// Kemaskini kapasiti (max_pax) sahaja
exports.updateCapacityApi = async (req, res) => {
    const sku = req.params.sku;

    // Validate SKU
    const validation = skuSchema.safeParse(sku);
    if (!validation.success) return res.status(400).json({ message: validation.error.errors[0].message });
    const { max_pax } = req.body;
    const user = req.session.user;

    if (max_pax === undefined || max_pax === null) {
        return res.status(400).json({ message: 'Kapasiti tidak sah.' });
    }

    // Check ownership if user is a partner
    if (user.role === 'partner') {
        const vacation = db.prepare('SELECT owner_id FROM vacations WHERE sku = ?').get(sku);
        if (!vacation || vacation.owner_id !== user.id) {
            return res.status(403).json({ message: 'Anda tidak mempunyai kebenaran untuk mengubah aktiviti ini.' });
        }
    }

    const stmt = db.prepare('UPDATE vacations SET max_pax = ? WHERE sku = ?');
    const info = stmt.run(max_pax, sku);

    if (info.changes > 0) {
        res.json({ success: true, message: 'Kapasiti berjaya dikemaskini.' });
    } else {
        res.status(404).json({ message: 'Aktiviti tidak ditemui.' });
    }
}

