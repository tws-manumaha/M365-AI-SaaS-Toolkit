const express = require('express');
const path = require('path');
require('dotenv').config();

// ✅ ROUTES
const moduleRoutes = require('./routes/moduleRoutes');

// ✅ ENGINE CLEANUP
const powerShellPool = require('./engine/powershellPool');
const db = require('./config/db');

const app = express();

// ✅ MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ✅ STATIC FILES (UI)
app.use(express.static(path.join(__dirname, '..', 'public')));


// ✅ API ROUTES
app.use('/api/modules', moduleRoutes);


// ✅ HEALTH CHECK
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        time: new Date().toISOString()
    });
});


// ✅ DEFAULT ROUTE (LOAD UI)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


// ✅ ERROR HANDLER (GLOBAL)
app.use((err, req, res, next) => {

    console.error("❌ Unhandled Error:", err);

    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});


// ✅ GRACEFUL SHUTDOWN
async function shutdown() {
    console.log("🛑 Shutting down server...");

    try {
        powerShellPool.destroyAll();
        await db.closePool();

        process.exit(0);
    } catch (err) {
        console.error("Shutdown error:", err);
        process.exit(1);
    }
}


// ✅ HANDLE TERMINATION SIGNALS
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);


// ✅ START SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🔥 Server running at http://localhost:${PORT}`);
});