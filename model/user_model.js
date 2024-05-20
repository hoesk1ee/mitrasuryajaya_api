const pool = require('../db/index');

// * Read user based on ID
async function getUserById(userId){
    const query = `SELECT * FROM users WHERE user_id = $1`;

    const values = [userId];

    const result = await pool.query(query, values);

    return result.rows;
}

module.exports = {
    getUserById,
};