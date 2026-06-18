const { Pool } = require('pg');
require('dotenv').config();

// ✅ CREATE CONNECTION POOL
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'm365_platform',
    port: process.env.DB_PORT || 5432,
    max: 20, // ✅ max concurrent connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});


// ✅ TEST CONNECTION
pool.connect()
    .then(client => {
        console.log('✅ Database connected');
        client.release();
    })
    .catch(err => {
        console.error('❌ Database connection error:', err.message);
    });


// ✅ GENERIC QUERY FUNCTION
async function query(text, params) {
    const start = Date.now();

    try {
        const res = await pool.query(text, params);

        const duration = Date.now() - start;

        if (process.env.NODE_ENV !== 'production') {
            console.log('📊 Query executed:', {
                text,
                duration,
                rows: res.rowCount
            });
        }

        return res;

    } catch (err) {
        console.error('❌ Query failed:', err.message);
        throw err;
    }
}


// ✅ TRANSACTION SUPPORT
async function transaction(callback) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await callback(client);

        await client.query('COMMIT');

        return result;

    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}


// ✅ CONNECTION CLOSE (GRACEFUL SHUTDOWN)
async function closePool() {
    await pool.end();
    console.log('🛑 Database pool closed');
}


// ✅ EXPORT
module.exports = {
    query,
    transaction,
    closePool
};