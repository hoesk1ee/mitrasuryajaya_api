const pool = require('../db/index');

// * Read user based on ID
async function getUserById(userId){
    const query = `SELECT * FROM users WHERE user_id = $1`;

    const values = [userId];

    const result = await pool.query(query, values);

    return result.rows[0];
}

// * Read all user for data purpose.
async function getAllUser(){
    const query = `SELECT * FROM users`;

    const result = await pool.query(query);

    return result.rows;
}

// * Create new user
async function createUser(userId, photo_url, userRole, userName, phoneNumber, email){
    const query = `
        INSERT INTO 
            users(user_id, photo_url, user_role, user_name, phone_number, email, is_verified)
        VALUES
            ($1, $2, $3, $4, $5, $6, false)
    `;

    const values = [userId, photo_url, userRole, userName, phoneNumber, email];

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
    getAllUser,
    createUser,
    updateUserVerification,
};