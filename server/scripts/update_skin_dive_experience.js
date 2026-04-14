const db = require('../db');

const newActivity = {
    sku: 'skin-dive-experience-perhentian',
    name: '3. PERHENTIAN SKIN DIVE EXPERIENCE',
    description: '"Too deep for snorkelers, too light for freedivers perfect for those who prefer a light and relaxing dive." Spots: Tiga Ruang (Warm up), Turtle Point, Nemo Point (Nemo & Cave), Coral Garden (Depth training), Shark Point (Cave). itinerary: 8:00am-meet, 8:30am-depart, 10:30am-warm up, 11:00am-Turtle Pt, 12:30pm-Nemo Pt, 4:00pm-depart back, 5:00pm-arrive KB.',
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
        { icon: "fas fa-exclamation-triangle", text: "Bring your own mask/snorkel/fins (Weight & lunch not info/provided)" },
        { icon: "fas fa-route", text: "8:00 AM - Meet at Kuala Besut Jetty" }
    ])
};

try {
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

    insert.run(newActivity);
    console.log('✅ Skin Dive Experience Stop activity added/updated successfully!');
} catch (error) {
    console.error('❌ Failed to update database:', error);
}
