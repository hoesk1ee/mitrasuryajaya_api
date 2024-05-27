const pool = require('../db/index');

// * Read All Cart
async function getAllCart(userId){
    const query = `
        SELECT c.cart_id, c.user_id, c.product_exp_id, p.product_name, pd.product_detail_pic,
        pd.product_detail_name, pd.price
        FROM cart c 
        JOIN product_exp pe ON c.product_exp_id = pe.product_exp_id
        JOIN product_detail pd ON pe.product_detail_id = pd.product_detail_id
        JOIN products p ON pd.product_id = p.product_id
        WHERE c.user_id = $1
    `;

    const values = [userId];

    const result = await pool.query(query, values);

    return result.rows;
};

module.exports = {
    getAllCart
};