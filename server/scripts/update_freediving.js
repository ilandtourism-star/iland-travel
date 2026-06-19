const db = require('../db');

const newActivity = {
    sku: 'free-dive-perhentian',
    name: '3. PERHENTIAN FREE DIVING DAYTRIP',
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
    console.log('✅ Freediving activity added/updated successfully!');
} catch (error) {
    console.error('❌ Failed to update database:', error);
}
