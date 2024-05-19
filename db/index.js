const { Pool } = require('pg');

// * POstgres user for Hoeskie
// const pool = new Pool({
//     user: 'hoeskie',
//     host: 'localhost',
//     database: 'mitra_surya_jaya',
//     password: 'postgres',
//     port: 5432,
// });

// * Postgres user for JeSan05
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mitra_surya_jaya',
    password: 'postgres',
    port: 5432,
});

module.exports = pool;