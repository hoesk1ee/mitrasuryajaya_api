const { Pool } = require('pg');

const pool = new Pool({
    user: 'hoeskie',
    host: 'localhost',
    database: 'mitra_surya_jaya',
    password: 'postgres',
    port: 5432,
});

module.exports = pool;