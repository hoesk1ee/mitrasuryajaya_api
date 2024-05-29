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

// * Add new cart
async function addCart(userId, productBarcode){
    const query = `
        INSERT INTO cart(user_id, product_exp_id, quantity)
        SELECT temp.user_id, pe.product_exp_id, temp.quantity
        FROM (VALUES 
            ($1, $2, 1)
        ) AS
        temp (user_id, product_barcode, quantity)
        JOIN product_exp pe ON temp.product_barcode = pe.product_barcode
    `;

    const values = [userId, productBarcode];

    await pool.query(query, values);
};

// * Delete cart based on user_id and product_exp_id
async function deleteCart(userId, productExpId){
    const query = `DELETE FROM cart WHERE user_id = $1 AND product_exp_id = $2`;

    const values = [userId, productExpId];

    await pool.query(query,values);
};

module.exports = {
    getAllCart,
    addCart,
    deleteCart
};