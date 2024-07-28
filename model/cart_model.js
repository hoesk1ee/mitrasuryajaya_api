const pool = require('../db/index');

// * Read All Cart
async function getAllCart(userId){
    const query = `
        SELECT c.cart_id, c.user_id, c.product_exp_id, p.product_name, pd.product_detail_pic,
        pd.product_detail_name, pd.price, c.quantity, pe.exp_date
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
    try{
        // * Begin Transaction
        await pool.query('BEGIN');

        // * Ambil nilai product barcode di product_exp
        const queryCekBarcode = `
            SELECT 
                product_barcode FROM product_exp
            WHERE product_barcode = $1
        `;

        const valuesCekBarcode = [productBarcode];

        const resultCekBarcode = await pool.query(queryCekBarcode, valuesCekBarcode);

        // * Cek apakah produck barcode ada atau tidak
        if(resultCekBarcode.rowCount === 0){
            return false
        }
        
        // * Jika ada, ambil Nilai product_barcode pada cart
        const queryGetBarcode = `
            SELECT 
                pe.product_barcode FROM product_exp pe 
            JOIN cart c ON pe.product_exp_id = c.product_exp_id
            WHERE c.user_id = $1 and product_barcode = $2 
        `;

        const valuseGetBarcode = [userId, productBarcode];

        const resultGetBarcode = await pool.query(queryGetBarcode, valuseGetBarcode);

        // * Cek product barcode, jika tidak ada maka tambahkan ke cart
        if(resultGetBarcode.rowCount === 0){
            const query = `
                INSERT INTO cart(user_id, product_exp_id, quantity)
                SELECT temp.user_id, pe.product_exp_id, temp.quantity
                FROM (VALUES 
                    ($1, $2, 1)
                ) AS
                temp (user_id, product_barcode, quantity)
                JOIN product_exp pe ON temp.product_barcode = pe.product_barcode
                RETURNING product_exp_id
            `;

            const values = [userId, productBarcode];

            const result = await pool.query(query, values);

            if(result.rowCount == 0){
                throw new Error('Insert Failed');
            }

            // * Ambil nilai beberapa data untuk ditampilkan di layar
            const queryGet = `
                    SELECT pd.product_detail_pic, p.product_name, pd.product_detail_name,
                        pd.price, pe.exp_date
                    FROM product_exp pe 
                    JOIN product_detail pd ON pe.product_detail_id = pd.product_detail_id
                    JOIN products p ON pd.product_id = p.product_id
                    WHERE pe.product_exp_id = $1
            `;

            const valuesGet = [result.rows[0].product_exp_id];

            const resultGet = await pool.query(queryGet, valuesGet);
                
            // * Commit Transaction
            await pool.query('COMMIT');
                
            return resultGet.rows;
        }
        // * Jika product barcode sudah ada maka quantity ditambah 1
        else if(resultGetBarcode.rows[0].product_barcode === productBarcode){
            const query = `
                UPDATE cart c 
                    SET quantity = c.quantity + 1 
                FROM product_exp pe 
                WHERE c.product_exp_id = pe.product_exp_id 
                    AND c.user_id = $1 AND pe.product_barcode = $2
            `;
            
            const values = [userId, productBarcode];

            const result = await pool.query(query, values);

            if(result.rowCount == 0){
                throw new Error('Insert Failed');
            }

            // * Ambil nilai beberapa data untuk ditampilkan di layar
            const queryGet = `
                SELECT pd.product_detail_pic, p.product_name, pd.product_detail_name,
                    pd.price, pe.exp_date
                FROM product_exp pe 
                JOIN product_detail pd ON pe.product_detail_id = pd.product_detail_id
                JOIN products p ON pd.product_id = p.product_id
                WHERE pe.product_barcode = $1
            `;

            const valuesGet = [productBarcode];

            const resultGet = await pool.query(queryGet, valuesGet);

            // * Commit Transaction
            await pool.query('COMMIT');

            return resultGet.rows;
        }
    }catch(e){
        // * Rollback Transaction if error
        await pool.query('ROLLBACK');
        throw e;
    }
    
};

// * Delete cart based on user_id and product_exp_id
async function deleteCart(userId, productExpId){
    const query = `DELETE FROM cart WHERE user_id = $1 AND product_exp_id = $2`;

    const values = [userId, productExpId];

    await pool.query(query,values);
};

// * Update quantity based on user_id and product_exp_id
async function updateCart( quantity, cartId, userId){
    const query = `UPDATE cart SET quantity = $1 WHERE cart_Id = $2 AND user_id = $3`;

    const values = [quantity, cartId, userId];

    await pool.query(query, values);
};

module.exports = {
    getAllCart,
    addCart,
    deleteCart,
    updateCart
};