const fetch = require('node-fetch')
const baseUrl = 'http://localhost:5000'

const _fetch = async (method, path, body) => {
    // Tukar objek ke string JSON jika perlu
    if (body) {
        body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    const headers = { 'Content-Type': 'application/json' }

    const res = await fetch(baseUrl + path, { method, body, headers })

    // Jika status bukan dalam lingkungan 200 (berjaya), cetus ralat
    if (res.status < 200 || res.status > 299)
        throw new Error(`API memulangkan status ${res.status}`)

    return res.json()
}

describe('Ujian API', () => {
    test('GET /api/vacations', async () => {
        // Pastikan server sudah mempunyai data ini atau mock data ini
        const vacations = await _fetch('get', '/api/vacations')
        expect(vacations.length).not.toBe(0) // Pastikan senarai tidak kosong
    })

    test('DELETE /api/vacation/:id', async () => {
        const vacations = await _fetch('get', '/api/vacations')
        if (vacations.length > 0) {
            const vacation0 = vacations[0]
            // Pastikan permintaan DELETE berjaya
            // Nota: Endpoint ini perlu wujud di server
            const result = await _fetch('delete', `/api/vacation/${vacation0.sku}`)
            expect(result).toBeDefined()
        }
    })

    test('POST /api/vacation menambah data baru', async () => {
        const newVacation = { sku: 'TEST999', name: 'Ujian POST', description: 'Deskripsi ujian' };
        const res = await _fetch('post', '/api/vacation', newVacation);
        expect(res.vacation).toBeDefined();
        expect(res.vacation.sku).toBe('TEST999');
    })

    test('PUT /api/vacation/:sku mengemaskini data', async () => {
        const updateData = { name: 'Nama Dikemaskini' };
        // Gunakan SKU dari POST tadi
        const res = await _fetch('put', '/api/vacation/TEST999', updateData);
        expect(res.vacation.name).toBe('Nama Dikemaskini');
    })
})
