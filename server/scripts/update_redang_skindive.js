const db = require('../db');

const newActivity = {
    sku: 'skin-dive-redang',
    name: '3. REDANG SKIN DIVE EXPERIENCE',
    description: '"Too deep for snorkelers, too light for freedivers --perfect for those who prefer a light and relaxing dive." Spots: Pulau Lima, Coral Cave / Gua Kawah, Pulau Paku, Turtle Point, Marine Park. Itinerary: 8:00 AM-Board boat, 9:30 AM-Dive session 1, 12:00 PM-Lunch break, 1:00 PM-Dive session 2, 4:00 PM-Return to jetty.',
    price: 25000,
    childPrice: null,
    island: 'Redang',
    category: 'snorkeling',
    is_in_season: 1,
    imageUrl: '/images/Redang island/redang_skin_dive.png',
    features: JSON.stringify([
        { icon: "fas fa-ship", text: "Return boat transfer" },
        { icon: "fas fa-user-shield", text: "Guide / Safety Supervision" },
        { icon: "fas fa-chalkboard-teacher", text: "Basic Skin Dive Coaching" },
        { icon: "fas fa-utensils", text: "Lunch & Mineral Water" },
        { icon: "fas fa-video", text: "Underwater Footage (Personal Video)" },
        { icon: "fas fa-exclamation-triangle", text: "Bring own mask/snorkel/fins (Weight & MP fee not included)" }
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
    console.log('✅ Redang Skin Dive activity added/updated successfully!');
} catch (error) {
    console.error('❌ Failed to update database:', error);
}
