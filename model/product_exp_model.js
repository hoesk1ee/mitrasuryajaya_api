const pool = require('../db/index');

// * Read all product exp
async function getAllProductExp(productDetailId){
    const query = `
        SELECT pd.product_detail_pic, pd.product_detail_name, pd.price, pe.product_detail_id, pe.exp_date, pe.quantity, pe.product_barcode 
        FROM product_exp pe 
        JOIN product_detail pd ON pe.product_detail_id = pd.product_detail_id
        WHERE pe.product_detail_id = $1 AND is_deleted = false`;

    const values = [productDetailId];

    const result = await pool.query(query, values);

    return result.rows;
};

// * Add product expired
async function addProductExp(productDetailId, expDate, quantity, productBarcode){
    const query = `
        INSERT INTO product_exp(product_detail_id, exp_date, quantity, product_barcode, is_deleted)
        VALUES ($1, $2, $3, $4, false)
    `;

    const values = [ productDetailId, expDate, quantity, productBarcode ];

    await pool.query(query, values);
};

// * Delete product expired based on product_detail_id and product_exp_id
async function deleteProductExp(quantity, productExpId, transactionType, note){
    try{
        // * Begin transaction
        await pool.query('BEGIN');

        // * Delete product_exp
        const queryDelete = `
            UPDATE product_exp 
            SET quantity = quantity - $1, is_deleted = true
            WHERE product_exp_id = $2
        `;

        const valuesDelete = [quantity, productExpId];

        const result = await pool.query(queryDelete, valuesDelete);

        // * Check if delete was success
        if(result.rowCount === 0 ){
            throw new Error('Delete failed');
        }

        // * After success delete product_exp, insert into product_transaction
        const queryInsert = `
            INSERT INTO product_transaction(product_exp_id, transaction_type, quantity, note)
            VALUES ($1, $2, $3, $4)
        `;

        const valuesInsert = [productExpId, transactionType, quantity, note];

        await pool.query(queryInsert, valuesInsert);

        // * Commit transaction
        await pool.query('COMMIT');
    } catch(e){
        // * Rollback Transaction if error
        await pool.query('ROLLBACK');
        throw e;
    }
};

module.exports = {
    getAllProductExp,
    addProductExp,
    deleteProductExp
};