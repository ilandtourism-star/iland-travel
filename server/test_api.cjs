const db = require('./db');

try {
    const options = { island: 'Perhentian', category: 'snorkeling' };
    const vacations = db.getVacations(options);
    console.log('Success! Found:', vacations.length);
} catch (err) {
    console.error('API Simulation Error:', err);
}
