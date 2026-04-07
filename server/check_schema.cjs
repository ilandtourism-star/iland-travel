const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'iland_v2.db'));
const info = db.pragma('table_info(vacations)');
console.log(JSON.stringify(info, null, 2));
db.close();
