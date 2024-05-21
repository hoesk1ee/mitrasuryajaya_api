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

// * Update user verification
async function updateUserVerification(userId){
    const updateVerifStatus = `UPDATE users SET is_verified = true WHERE user_id = $1`;
    const checkVerifStatus = `SELECT is_verified from users WHERE user_id = $1`;

    const values = [userId];
  
    const result = await pool.query(checkVerifStatus, values);

    if(result.rows[0].is_verified) {
        return true
    } else {
        await pool.query(updateVerifStatus, values);
        return false
    }
}

module.exports = {
    getUserById,
    createUser,
    updateUserVerification,
};