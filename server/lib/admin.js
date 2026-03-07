const express = require('express');
const admin = express.Router();

admin.get('/', (req, res) => {
    res.send('<h1>Selamat Datang ke Halaman Admin iland</h1><p>Ini adalah subdomain admin.iland.local</p>');
});

// Anda boleh tambah lagi route admin di sini
admin.get('/dashboard', (req, res) => {
    res.json({ message: 'Dashboard Admin', stats: 'Data statistik di sini' });
});

module.exports = admin;
