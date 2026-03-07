const db = require('../db');

console.log('--- Database Schema Introspection ---');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

for (const table of tables) {
    console.log(`\nTable: ${table.name}`);
    const columns = db.pragma(`table_info(${table.name})`);
    const fks = db.pragma(`foreign_key_list(${table.name})`);

    console.table(columns.map(c => ({ name: c.name, type: c.type, notnull: c.notnull === 1, pk: c.pk === 1 })));

    if (fks.length > 0) {
        console.log('Foreign Keys:');
        console.table(fks);
    } else {
        console.log('No Foreign Keys defined.');
    }
}

console.log('\n--- End of Introspection ---');
