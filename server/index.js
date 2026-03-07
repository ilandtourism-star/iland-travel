const cluster = require('cluster');
const os = require('os');
const path = require('path');

// Redundancy Pillar: Application Clustering
// Ini memastikan jika satu proses "crash", proses lain tetap hidup untuk melayani pengguna.

/**
 * Cegah Kegagalan "Halimun" (Invisible Failures)
 * Menangkap ralat global yang tidak ditangkap oleh handler biasa.
 */
const logCriticalError = (title, err) => {
    const timestamp = new Date().toISOString();
    console.error(`\n[CRITICAL ERROR] ${timestamp} - ${title}`);
    console.error(err);
    console.error('--------------------------------------------------\n');
};

process.on('uncaughtException', (err) => {
    logCriticalError('Uncaught Exception', err);
    // Master process should only exit if it can't recover. 
    // Workers will be restarted by cluster.on('exit')
});

process.on('unhandledRejection', (reason, promise) => {
    logCriticalError('Unhandled Rejection', reason);
});

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`--- iland-app Cluster Master ${process.pid} Starting ---`);
    console.log(`Monitoring ${numCPUs} CPU cores for redundancy...\n`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`[ALERT] Worker ${worker.process.pid} died (Code: ${code}, Signal: ${signal}).`);
        console.log(`Restarting worker for zero-downtime redundancy...`);
        cluster.fork();
    });

    // Automated Backup Redundancy (Run every 24 hours)
    setInterval(() => {
        console.log(`[EVENT] ${new Date().toISOString()} - Triggering Scheduled Backup`);
        try {
            require('./scripts/backup_db');
        } catch (err) {
            logCriticalError('Background Backup Failure', err);
        }
    }, 24 * 60 * 60 * 1000);

} else {
    // Workers share the TCP connection
    require('./server.js');
    console.log(`Worker process ${process.pid} started and serving requests.`);
}
