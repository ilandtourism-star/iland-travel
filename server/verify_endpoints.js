const fetch = require('node-fetch');

const baseUrl = 'http://localhost:5000';

async function verifyEndpoints() {
    console.log('--- Verifying /api/login (POST) ---');
    try {
        // Attempt login with seeded admin credentials
        const loginData = { username: 'admin', password: 'password123' };

        const loginRes = await fetch(`${baseUrl}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        });

        const loginResponseData = await loginRes.json();
        console.log('Status:', loginRes.status);
        console.log('Response:', loginResponseData);

        if (loginRes.status === 200 && loginResponseData.message === 'Login berjaya!') {
            console.log('✅ /api/login PASSED');
        } else {
            console.log('❌ /api/login FAILED');
            return; // Stop if login fails
        }

        // Extract cookie
        const cookie = loginRes.headers.get('set-cookie');
        console.log('Session Cookie:', cookie);

        console.log('\n--- Verifying /api/vacations (GET - Public) ---');
        const vacationsRes = await fetch(`${baseUrl}/api/vacations`);
        const vacationsList = await vacationsRes.json();
        console.log('Vacations Count:', vacationsList.length);
        if (vacationsList.length > 0) console.log('✅ /api/vacations PASSED');

        console.log('\n--- Verifying /api/booking (POST) ---');
        const bookingData = {
            firstName: 'DB User',
            email: 'dbuser@example.com',
            packageName: 'DB Test Package',
            date: '2023-12-31',
            pax: 5
        };

        const bookingRes = await fetch(`${baseUrl}/api/booking`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        const bookingResponseData = await bookingRes.json();
        console.log('Status:', bookingRes.status);
        console.log('Response:', bookingResponseData);

        if (bookingRes.status === 201 && bookingResponseData.success) {
            console.log('✅ /api/booking (POST) PASSED');
        } else {
            console.log('❌ /api/booking (POST) FAILED');
        }

        console.log('\n--- Verifying /api/bookings (GET - Admin) ---');
        const bookingsRes = await fetch(`${baseUrl}/api/bookings`, {
            headers: {
                'Cookie': cookie // Send session cookie
            }
        });

        if (bookingsRes.status === 200) {
            const bookingsList = await bookingsRes.json();
            console.log('Status:', bookingsRes.status);
            console.log('Bookings Count:', bookingsList.length);
            console.log('Last Booking:', bookingsList[0]); // Should be the one we just added
            console.log('✅ /api/bookings (GET) PASSED');
        } else {
            console.log('Status:', bookingsRes.status);
            console.log('Response:', await bookingsRes.text());
            console.log('❌ /api/bookings (GET) FAILED');

        }

    } catch (error) {
        console.error('Verification Error:', error);
    }
}

verifyEndpoints();
