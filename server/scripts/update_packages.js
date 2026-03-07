const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../iland_v2.db');
const db = new Database(dbPath, { timeout: 10000 });

console.log("Starting DB Update...");

const data = [
    ["relax-kapas", "1. Relaxation (island hopping only)", "", 4900, 3900, null, null, "Kapas", '[{"icon":"fas fa-ship","text":"BOAT TRANSFER"},{"icon":"fas fa-vest","text":"LIFE JACKET"},{"icon":"fas fa-umbrella-beach","text":"FREE DAN EASY"}]', "snorkeling", "/images/kapas island/1. Relaxation Package/1.png", 1, 12],
    ["mental-escape-kapas", "2. Mental Escape", "", 5900, 4900, null, null, "Kapas", '[{"icon":"fas fa-mask","text":"Snorkeling Gear"},{"icon":"fas fa-ship","text":"Boat Transfer"},{"icon":"fas fa-vest","text":"LIFE JACKET (FULL DAY)"}]', "snorkeling", "/images/kapas island/2. Mental Escape/1.png", 1, 12],
    ["joy-play-kapas", "3. Joy & Playfulness", "", 6900, 5900, null, null, "Kapas", '[{"icon":"fas fa-fish","text":"Marine Park Trip"},{"icon":"fas fa-vest","text":"LIFE JACKET (FULL DAY)"},{"icon":"fas fa-mask","text":"SNORKELING EQUIPMENT (FULL DAY)"},{"icon":"fas fa-ship","text":"BOAT TRANSFER"}]', "snorkeling", "/images/kapas island/3. Joy & Playfulness (Top Pick!)/2.png", 1, 12],
    ["mood-booster-kapas", "4. Mood Booster", "", 10900, 9900, null, null, "Kapas", '[{"icon":"fas fa-map-marked-alt","text":"ISLAND TOUR"},{"icon":"fas fa-hiking","text":"HIKING BUKIT SINGA"},{"icon":"fas fa-fish","text":"TRIP MARINE PARK POINT"},{"icon":"fas fa-mask","text":"SNORKELING EQUIPMENT (FULL DAY)"},{"icon":"fas fa-vest","text":"LIFE JACKET (FULL DAY)"},{"icon":"fas fa-ship","text":"BOAT TRANSFER"}]', "snorkeling", "/images/kapas island/4. Mood Booster/6.png", 1, 12],
    ["private-boat-10pax-kapas", "5. Private Boat Trip (max 10pax)", "", 85000, null, "/uploads/photos/photo-1771733881648-831386798.jpg", 2, "Kapas", '[{"icon":"fas fa-ship","text":"PRIVATE BOAT TRANSFER"},{"icon":"fas fa-mask","text":"SNORKELING EQUIPMENT FULLDAY"},{"icon":"fas fa-vest","text":"LIFE JACKET FULLDAY"}]', "boat_trip_family", "/images/Private Boat Trip/21.png", 1, 12],
    ["private-boat-15pax-kapas", "6. Private Boat Trip (max 15pax)", "", 105000, null, null, null, "Kapas", '[{"icon":"fas fa-ship","text":"PRIVATE BOAT TRANSFER"},{"icon":"fas fa-mask","text":"SNORKELING EQUIPMENT FULLDAY"},{"icon":"fas fa-vest","text":"LIFE JACKET FULLDAY"}]', "boat_trip_family", "/images/Private Boat Trip/21.png", 1, 12],
    ["private-boat-25pax-kapas", "7. Private Boat Trip (max 25pax)", "", 175000, null, null, null, "Kapas", '[{"icon":"fas fa-ship","text":"PRIVATE BOAT TRANSFER"},{"icon":"fas fa-mask","text":"SNORKELING EQUIPMENT FULLDAY"},{"icon":"fas fa-vest","text":"LIFE JACKET FULLDAY"}]', "boat_trip_family", "/images/Private Boat Trip/21.png", 1, 12],
    ["private-boat-40pax-kapas", "8. Private Boat Trip (max 40pax)", "", 280000, null, null, null, "Kapas", '[{"icon":"fas fa-ship","text":"PRIVATE BOAT TRANSFER"},{"icon":"fas fa-mask","text":"SNORKELING EQUIPMENT FULLDAY"},{"icon":"fas fa-vest","text":"LIFE JACKET FULLDAY"}]', "boat_trip_family", "/images/Private Boat Trip/21.png", 1, 12],
    ["private-package-10pax-kapas", "9. Private Boat Package (max 10pax)", "", 140000, null, null, null, "Kapas", '[{"icon":"fas fa-ship","text":"PRIVATE BOAT TRANSFER"},{"icon":"fas fa-swimmer","text":"ALL ACTIVITIES & EQUIPMENT"},{"icon":"fas fa-glass-cheers","text":"UNLIMITED COLD DRINK"},{"icon":"fas fa-utensils","text":"FREE MEALS"},{"icon":"fas fa-map-marker-alt","text":"MORE THAN 1 SNORKELING POINTS"}]', "boat_trip_exclusive", "/images/Private Boat Package/makan.png", 1, 12],
    ["private-package-15pax-kapas", "10. Private Boat Package (max 15pax)", "", 180000, null, null, null, "Kapas", '[{"icon":"fas fa-ship","text":"PRIVATE BOAT TRANSFER"},{"icon":"fas fa-swimmer","text":"ALL ACTIVITIES & EQUIPMENT"},{"icon":"fas fa-glass-cheers","text":"UNLIMITED COLD DRINK"},{"icon":"fas fa-utensils","text":"FREE MEALS"},{"icon":"fas fa-map-marker-alt","text":"MORE THAN 1 SNORKELING POINTS"}]', "boat_trip_exclusive", "/images/Private Boat Package/makan.png", 1, 12],
    ["private-package-25pax-kapas", "11. Private Boat Package (max 25pax)", "", 300000, null, null, null, "Kapas", '[{"icon":"fas fa-ship","text":"PRIVATE BOAT TRANSFER"},{"icon":"fas fa-swimmer","text":"ALL ACTIVITIES & EQUIPMENT"},{"icon":"fas fa-glass-cheers","text":"UNLIMITED COLD DRINK"},{"icon":"fas fa-utensils","text":"FREE MEALS"},{"icon":"fas fa-map-marker-alt","text":"MORE THAN 1 SNORKELING POINTS"}]', "boat_trip_exclusive", "/images/Private Boat Package/makan.png", 1, 12],
    ["private-package-40pax-kapas", "12. Private Boat Package (max 40pax)", "", 440000, null, null, null, "Kapas", '[{"icon":"fas fa-ship","text":"PRIVATE BOAT TRANSFER"},{"icon":"fas fa-swimmer","text":"ALL ACTIVITIES & EQUIPMENT"},{"icon":"fas fa-glass-cheers","text":"UNLIMITED COLD DRINK"},{"icon":"fas fa-utensils","text":"FREE MEALS"},{"icon":"fas fa-map-marker-alt","text":"MORE THAN 1 SNORKELING POINTS"}]', "boat_trip_exclusive", "/images/Private Boat Package/makan.png", 1, 12],
    ["snorkeling-redang", "1. Day Trip Snorkeling (All-In)", "Spots: LITTLE MALDIVES - PULAU PAKU - TELUK KURMA - EKOR TEBU - FISH POINT - TURTLE POINT", 10000, 8000, null, null, "Redang", '[{"icon":"fas fa-ship","text":"BOAT 2 WAYS"},{"icon":"fas fa-mask","text":"SNORKELING EQUIPMENT"},{"icon":"fas fa-vest","text":"LIFE JACKET"},{"icon":"fas fa-utensils","text":"LUNCH PACK"},{"icon":"fas fa-glass-cheers","text":"UNLIMITED DRINKS"},{"icon":"fas fa-map-marker-alt","text":"5/6 SNORKELING SPOTS"},{"icon":"fas fa-fish","text":"FREE FEEDING FISH"},{"icon":"fas fa-paw","text":"FREE FEEDING TURTLE"},{"icon":"fas fa-user-tie","text":"EXPERIENCED GUIDE"},{"icon":"fas fa-file-contract","text":"BOAT INSURANCE"}]', "snorkeling", "/images/Redang island/2.jpg", 1, 12],
    ["squid-jigging-redang", "2. Squid Jigging Package (Private Boat)", "", 135000, null, null, null, "Redang", '[{"icon":"fas fa-ship","text":"PRIVATE BOAT"},{"icon":"fas fa-anchor","text":"SQUID JIGGING EQUIPMENT"}]', "squid_jigging", "/images/Redang island/snorkeling2.png", 1, 12],
    ["snorkeling-perhentian", "1. Day Trip Snorkeling", "Spots: TELUK KEKE/TIGA RUANG - FISH POINT/CORAL GARDEN - SHARK POINT - TURTLE POINT - LATA AIR BERANI - KAMPUNG NELAYAN", 8000, 5000, null, null, "Perhentian", '[{"icon":"fas fa-ship","text":"2 WAYS BOAT TRANSFER"},{"icon":"fas fa-mask","text":"FULLSET SNORKLING EQUIPMENT"},{"icon":"fas fa-vest","text":"LIFE JACKET, MASK, GOOGLE"},{"icon":"fas fa-user-tie","text":"SNORKLING GUIDE TO ALL POINTS"},{"icon":"fas fa-fish","text":"SNORKLING TRIP 5/6 POINTS"}]', "snorkeling", "/images/perhentian island/1.png", 1, 12]
];

const insertStmt = db.prepare(`
  INSERT INTO vacations (
    sku, name, description, price, childPrice, image, owner_id, island, features, category, image_url, is_in_season, max_pax
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(sku) DO UPDATE SET
    name=excluded.name,
    description=excluded.description,
    price=excluded.price,
    childPrice=excluded.childPrice,
    image=excluded.image,
    owner_id=excluded.owner_id,
    island=excluded.island,
    features=excluded.features,
    category=excluded.category,
    image_url=excluded.image_url,
    is_in_season=excluded.is_in_season,
    max_pax=excluded.max_pax
`);

const transaction = db.transaction((rows) => {
    for (const row of rows) {
        insertStmt.run(row);
    }
});

try {
    transaction(data);
    console.log("Database update successful!");
} catch (err) {
    console.error("Error updating database:", err);
}
