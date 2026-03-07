# iland-app: Penjejak Isu & Log Pembangunan

Dokumen ini berfungsi sebagai sistem penjejak isu (Issue Tracker) dalaman untuk memantau pepijat (bugs), cadangan ciri baru (features), dan hutang teknikal (technical debt).

## 🟢 Isu Aktif (Active Issues)

| ID | Isu | Tahap | Status | Catatan |
| :--- | :--- | :--- | :--- | :--- |
| #001 | Integrasi Emel Notifikasi | Medium | Perancangan | Menghantar emel pengesahan selepas tempahan berjaya. |
| #002 | Dashboard Analitik Partner | Low | Dalam Kerja | Menambah graf prestasi jualan bulanan. |
| #003 | Manual Backup Script | High | Terbuka | Mencipta skrip automatik untuk backup `db.sqlite`. |

## 🔵 Cadangan Ciri Baru (Feature Requests)

- [ ] **Sistem Kupon:** Menambah kod diskaun untuk promosi bermusim.
- [ ] **Multi-Language Support:** Sokongan Bahasa Inggeris dan Mandarin untuk pelancong luar.
- [ ] **Mobile App:** Membina aplikasi mudah alih (React Native) menggunakan API v1 yang sedia ada.

## 🔴 Arkib Isu Selesai (Closed Issues)

| ID | Isu | Tarikh Selesai | Penyelesaian |
| :--- | :--- | :--- | :--- |
| #A01 | CSRF Token Mismatch | 2026-02-20 | Diperbaiki dalam `api.js` dengan sistem retry. |
| #A02 | Username Collision | 2026-02-20 | Penjanaan suffix unik dalam `user.routes.js`. |
| #A03 | Email Normalization | 2026-02-20 | Implementasi `.toLowerCase()` dalam Zod schemas. |

---
*Gunakan penanda [ISSUES] dalam mesej commit Git untuk merujuk kepada ID isu di atas.* 🛠️📡🏝️
