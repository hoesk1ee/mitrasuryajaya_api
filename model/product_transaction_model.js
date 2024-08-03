const pool = require('../db/index');

// * Read Product Transaction  based on Transaction_type = 'Tambah'
async function getAddProductTransaction(){
    const query = `
        SELECT 
            pt.transaction_type, pt.product_exp_id, p.product_name, pd.product_detail_name, 
            pe.product_barcode, pe.exp_date, pt.quantity, pt.note 
        FROM product_transaction pt
        JOIN product_exp pe ON pt.product_exp_id = pe.product_exp_id
        JOIN product_detail pd ON pe.product_detail_id = pd.product_detail_id
        JOIN products p ON pd.product_id = p.product_id
        WHERE transaction_type = 'Tambah'
        ORDER BY pt.quantity ASC
    `;

     const result = await pool.query(query);

    return result.rows;
};

// * Read product transaction based on transaction type = 'Kurang'
async function getReduceProductTransaction(){
    const query = `
        SELECT 
            pt.transaction_type, pt.product_exp_id, p.product_name, pd.product_detail_name, 
            pe.product_barcode, pe.exp_date, pt.quantity, pt.note 
        FROM product_transaction pt
        JOIN product_exp pe ON pt.product_exp_id = pe.product_exp_id
        JOIN product_detail pd ON pe.product_detail_id = pd.product_detail_id
        JOIN products p ON pd.product_id = p.product_id
        WHERE transaction_type = 'Kurang'
        ORDER BY pt.quantity ASC
    `;

    const result = await pool.query(query);

    return result.rows;
};

// * Read product transaction based on product_exp_id
async function getTransactionByProductExpId(productExpId){
    try{
        // * Begin Transaction
        await pool.query('BEGIN');
        
        // * Ambil nilai product_exp_id
        const queryGetProductExpId = `
            SELECT * FROM product_exp WHERE product_exp_id = $1
        `;

        const valuesGetProductExpId = [productExpId];

        const resultGetProductExpId = await pool.query(queryGetProductExpId, valuesGetProductExpId);

        // * Cek product_exp_id
        if(resultGetProductExpId.rowCount === 0){
            throw new Error('Product exp id tidak ada');
        }

        // * Jika product exp id ada, maka tampilkan list transaksi
        const query = `
            SELECT 
                pt.product_exp_id, p.product_name, pd.product_detail_name, pe.product_barcode, pe.exp_date, 
                pt.product_transaction_id, pt.transaction_date, pt.transaction_type, pt.quantity, pt.note 
            FROM product_transaction pt
            JOIN product_exp pe ON pt.product_exp_id = pe.product_exp_id
            JOIN product_detail pd ON pe.product_detail_id = pd.product_detail_id
            JOIN products p ON pd.product_id = p.product_id
            WHERE pt.product_exp_id = $1
            ORDER BY pt.transaction_date ASC
        `;

        const values = [productExpId];

        const result = await pool.query(query, values);

        // * Commit Transaction
        await pool.query('COMMIT');

        return result.rows;
    }catch(e){
        // * Rollback transaction if error
        await pool.query('ROLLBACK');
        throw e;
    }
};

async function getProductList(){
    try{
        const query = `
            SELECT 
                c.category_name, p.product_name, pd.product_detail_name, pd.price,
                pe.exp_date, pe.quantity, pe.product_barcode
            FROM category c 
            JOIN products p ON c.category_id = p.category_id
            JOIN product_detail pd ON p.product_id = pd.product_id
            JOIN product_exp pe ON pd.product_detail_id = pe.product_detail_id
            ORDER BY p.product_name
        `;

        const result = await pool.query(query);

        return result.rows;
    }catch(e){
        throw e;
    }
};

module.exports = {
    getAddProductTransaction,
    getReduceProductTransaction,
    getTransactionByProductExpId,
    getProductList
};
