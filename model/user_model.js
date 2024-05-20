const pool = require('../db/index');

// * Read user based on ID
async function getUserById(userId){
    const query = `SELECT * FROM users WHERE user_id = $1`;

    const values = [userId];

    const result = await pool.query(query, values);

    return result.rows[0];
}

// * Create new user
async function createUser(userId, photoUrl, userRole, userName, phoneNumber, email, isVerified){
    const query = `
    INSERT INTO users(user_id, photo_url, user_role, user_name, phone_number, email, is_verified)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7)
    `

    const values = [userId, photoUrl, userRole, userName, phoneNumber, email, isVerified];

    await pool.query(query, values);
}

module.exports = {
    getUserById,
    createUser,
};