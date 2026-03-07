require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();
const vhost = require('vhost');
const morgan = require('morgan'); // Import Morgan logger
const port = process.env.PORT || 5000;

// Konfigurasi Trust Proxy
app.set('trust proxy', 1); // Set to 1 if behind 1 proxy (e.g. Nginx/Heroku), or 'loopback' for localhost

// Seeding Vacations after routes are imported
const { seedVacations } = require('./handlers/vacation');
seedVacations();

// Logger Middleware (Morgan) - Logs method, url, status, res time
app.use(morgan('dev'));
app.set('query parser', 'simple');

// Import admin router
const admin = require('./lib/admin');
// --- API Routes ---
// New: modular routes
const routes = require('./routes/index');

// Helmet for Security Headers
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: false, // Matikan CSP default buat sementara waktu untuk elak isu frontend
  crossOriginResourcePolicy: { policy: "cross-origin" } // Benarkan resource load dari frontend
}));

// Compression
const compression = require('compression');
app.use(compression());

// Serve uploaded photos statically with caching
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '1d', // Cache selama 1 hari
  etag: true
}));

// Serve Frontend Static Files (Production)
// 1. Assets (Hashed) - Cache 1 year
app.use('/assets', express.static(path.join(__dirname, '../dist/assets'), {
  maxAge: '1y',
  etag: true
}));

// 2. Others (index.html, favicon, etc) - No Cache (ensure latest version)
app.use(express.static(path.join(__dirname, '../dist'), {
  maxAge: '0',
  etag: true
}));

// CORS — baca dari .env
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true })); // Parse standard HTML forms
app.use(cookieParser());

// Strict Content-Type Enforcement for API
app.use('/api', (req, res, next) => {
  const method = req.method;
  // Skip for GET, DELETE (no body) and Multipart (uploads)
  if (['GET', 'DELETE', 'HEAD', 'OPTIONS'].includes(method)) return next();
  if (req.headers['content-type']?.startsWith('multipart/form-data')) return next();

  if (req.headers['content-type'] !== 'application/json') {
    return res.status(415).json({
      success: false,
      message: 'Unsupported Media Type. Sila gunakan "application/json".'
    });
  }
  next();
});

// Storage Health Check Middleware (Lead Tracking & Resilience Perfection)
const db = require('./db');
app.use('/api', (req, res, next) => {
  if (!db.isHealthy()) {
    return res.status(503).json({
      success: false,
      message: 'Kegagalan Storan Total: Sistem sedang dalam mod penyelenggaraan kecemasan. Sila hubungi Admin.',
      error_code: 'STORAGE_FAILURE'
    });
  }
  next();
});

// Konfigurasi HTTPS (untuk local development guna mkcert)
let credentials = {};
let isHttps = false; // Default to false
try {
  credentials = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'localhost+2-key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'localhost+2.pem'))
  };
  isHttps = true; // Set true if certs found
} catch (err) {
  console.warn('Amaran: Sijil SSL tidak dijumpai. Mode HTTP digunakan. (Secure Cookies disabled)');
}

// ✅ SESSION — MESTI SEBELUM CSRF
const session = require('express-session');
const SqliteStore = require('better-sqlite3-session-store')(session);

app.use(session({
  store: new SqliteStore({
    client: db,
    expired: {
      clear: true,
      intervalMs: 900000 // 15 minit
    }
  }),
  secret: process.env.SESSION_SECRET || 'fallback_session_dev_secret',
  resave: false,
  saveUninitialized: true, // ✅ FIX: Force cookie to be set even if unmodified to stabilize Session ID
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 minggu
    secure: isHttps, // ✅ Dynamic: True ONLY if HTTPS (Localhost HTTPS = true)
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// 🔍 DEBUG MIDDLEWARE REMOVED
// app.use((req, res, next) => { ... });

// ✅ CSRF — SELEPAS SESSION (csrf-csrf v4)
const { doubleCsrf } = require('csrf-csrf');
const {
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'fallback_csrf_dev_secret',
  getSessionIdentifier: (req) => req.session.id,
  cookieName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    secure: isHttps, // Match session settings
  },
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => req.headers['x-csrf-token'] || req.query._csrf || req.body?._csrf,
});

app.get('/api/v1/csrf-token', (req, res) => {
  const token = generateCsrfToken(req, res);
  // console.log(`[CSRF-GEN] Session: ${req.session.id} | Token: ${token}`);
  res.json({ token });
});

// Apply CSRF protection untuk kaedah mutable
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return doubleCsrfProtection(req, res, next);
  }
  next();
});

// Error handling untuk CSRF
app.use((error, req, res, next) => {
  if (error.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      message: 'Ralat Keselamatan: Token CSRF tidak sah atau luput.'
    });
  }
  next(error);
});

// Konfigurasi HTTPS moved to top
// let credentials = {}; ... removed duplicate code

// Route asas
app.get('/', (req, res) => {
  res.send('Backend Server iland Berfungsi!');
});



// Rate Limiting for API (Global)
const rateLimit = require('express-rate-limit');
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan dari IP ini, sila cuba lagi selepas 15 minit.'
  }
});
app.use('/api', apiLimiter);

// Gunakan routes module untuk semua API call (Versi 1)
app.use('/api/v1', routes);

// Global 404 Handler untuk API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak dijumpai.' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Global Error Handler:', err); // Log error for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ralat Pelayan Dalaman';

  // Send JSON response
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack // Hide stack in production
  });
});

// Catch-All Route: Serve React App for any other requests (SPA Support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

if (credentials.key && credentials.cert) {
  https.createServer(credentials, app).listen(port, () => {
    console.log(`Pelayan HTTPS sedang berjalan di https://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Pelayan HTTP sedang berjalan di http://localhost:${port} (Sijil SSL tidak dijumpai)`);
  });
}
