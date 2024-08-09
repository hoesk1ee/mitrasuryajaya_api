const pool = require('../db/index');

// * Method to check verified user
async function checkUserIdAndVerification(req, res, next){
    try {
        const userId = req.headers['user-id'];

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Tidak ada ID user yang dikirimkan pada headers!",
            });
        }

        // * Query database to get userId and check verification status
        const query = "SELECT is_verified FROM users WHERE user_id = $1";
        const result = await pool.query(query, [userId]);

        // * If no result
        if(result.rows.length === 0){
            return res.status(400).json({
                success: false,
                message: "Tidak ada user dengan ID ini!",
            });
        }

        const { is_verified } = result.rows[0];

        // * If user is not verified
        if (!is_verified){
            return res.status(403).json({
                success: false,
                message: "Akun ini belum diverifikasi. Silahkan hubungi admin!",
            });
        }

        // * If all requirements approved
        next();
    } catch(e) {
        // * Handle error
        res.status(500).json({
            success: false,
            message: `Internal server error : ` + e
        });
    }
}

module.exports = checkUserIdAndVerification;