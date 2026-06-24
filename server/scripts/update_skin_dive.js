const db = require('../db');

const newActivity = {
    sku: 'skin-dive-perhentian',
    name: '2. LEARN SKINDIVING',
    description: 'Your first step into freediving. 1.5 Hours Learning Session. Suitable for beginner to intermediate snorkelers.',
    price: 26000,
    childPrice: null,
    island: 'Perhentian',
    category: 'snorkeling',
    is_in_season: 1,
    imageUrl: '/images/perhentian island/learn_skindiving.jpg',
    features: JSON.stringify([
        { icon: "fas fa-clock", text: "1.5 Hours Learning Session" },
        { icon: "fas fa-ship", text: "Return Boat Transfer (KB Jetty - Perhentian)" },
        { icon: "fas fa-water", text: "Guided shallow dive (5-10m)" },
        { icon: "fas fa-lungs", text: "Proper breathing & relaxation" },
        { icon: "fas fa-swimmer", text: "Duck dive & equalization basics" }
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
