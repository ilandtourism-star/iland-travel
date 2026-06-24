const db = require('../db');

const newActivity = {
    sku: 'free-dive-redang',
    name: '4. REDANG FREE DIVING DAYTRIP',
    description: 'FunDive Redang Island. Diving Points: Bus Wreck, Jetski Wreck, Coral Cave, Lima Island. Terms & conditions: No freediving license required, participants must be able to swim & follow instructions.',
    price: 29900,
    childPrice: null,
    island: 'Redang',
    category: 'snorkeling',
    is_in_season: 1,
    imageUrl: '/images/Redang island/redang_freediving.jpg',
    features: JSON.stringify([
        { icon: "fas fa-video", text: "Underwater footage & picture" },
        { icon: "fas fa-clock", text: "1 hour dive for each point" },
        { icon: "fas fa-utensils", text: "1 x light breakfast & 1 x lunch" },
        { icon: "fas fa-id-card", text: "Marine park & district fees included" },
        { icon: "fas fa-ship", text: "Return boat included" },
        { icon: "fas fa-bottle-water", text: "Free flow mineral water & cold drinks" },
        { icon: "fas fa-user-shield", text: "Safety buddies included" }
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
    console.log('✅ Redang Free Diving activity added/updated successfully!');
} catch (error) {
    console.error('❌ Failed to update database:', error);
}
