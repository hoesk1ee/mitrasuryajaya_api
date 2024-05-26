const pool = require('../db/index');

// * Read all product exp
async function getAllProductExp(productDetailId){
    const query = `
        SELECT pd.product_detail_pic, pd.product_detail_name, pd.price, pe.product_detail_id, pe.exp_date, pe.quantity, pe.product_barcode 
        FROM product_exp pe 
        JOIN product_detail pd ON pe.product_detail_id = pd.product_detail_id
        WHERE pe.product_detail_id = $1`;

    const values = [productDetailId];

    const result = await pool.query(query, values);

    return result.rows;
};

// * Add product expired
async function addProductExp(productDetailId, expDate, quantity, productBarcode){
    const query = `
        INSERT INTO product_exp(product_detail_id, exp_date, quantity, product_barcode)
        VALUES ($1, $2, $3, $4)
    `;

    const values = [ productDetailId, expDate, quantity, productBarcode ];

    await pool.query(query, values);
};

module.exports = {
    getAllProductExp,
    addProductExp
};