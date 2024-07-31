const pool = require('../db/index');

// * Read all product exp
async function getAllProductExp(productDetailId){
    try{
        // * Begin Transaction
        await pool.query('BEGIN');
        
        const query = `
            SELECT 
                pd.product_id, p.product_name, pd.product_detail_pic, pd.product_detail_name, pd.price, pe.product_detail_id, pe.product_exp_id, pe.exp_date, pe.quantity, pe.product_barcode 
            FROM product_exp pe 
            JOIN product_detail pd ON pe.product_detail_id = pd.product_detail_id
            JOIN products p ON pd.product_id = p.product_id
            WHERE pe.product_detail_id = $1 AND is_deleted = false
        `;

        const values = [productDetailId];

        const result = await pool.query(query, values);

        // * Jika tidak ada produk exp maka hanya menampilkan produk detail saja
        if(result.rows.length == 0){
            const queryGet = `
                SELECT 
                    pd.product_id, p.product_name, pd.product_detail_id, pd.product_detail_pic, pd.product_detail_name, pd.price
                FROM 
                    product_detail pd 
                JOIN products p ON pd.product_id = p.product_id
                WHERE pd.product_detail_id = $1
        `;

            const valuesGet = [productDetailId];

            const resultGet = await pool.query(queryGet,valuesGet);

            return{
                product_id : resultGet.rows[0].product_id,
                product_name : resultGet.rows[0].product_name,
                product_detail_id : resultGet.rows[0].product_detail_id,
                product_detail_pic : resultGet.rows[0].product_detail_pic,
                product_detail_name : resultGet.rows[0].product_detail_name,
                price : resultGet.rows[0].price
            };
        }

        // * Commit Transaction
        await pool.query('COMMIT');

        return result.rows;
    }catch(e){
        // * Rollback Transaction if error
        await pool.query('ROLLBACK');
        throw e;
    }
    
};

// * Add product expired
async function addProductExp(productDetailId, expDate, quantity, productBarcode){
    try{
        // * Begin Transaction
        await pool.query('BEGIN');

        // * Insert to Product_exp
        const query = `
            INSERT INTO product_exp(product_detail_id, exp_date, quantity, product_barcode, is_deleted)
            VALUES ($1, $2, $3, $4, false)
            RETURNING product_exp_id, quantity
        `;

        const values = [ productDetailId, expDate, quantity, productBarcode ];

        const result = await pool.query(query, values);

        // * Check insert ke tabel sukses atau tidak
        if(result.rowCount == 0){
            throw new Error('Product Expired Gagal Ditambahkan!');
        }

        // * Insert ke tabel product_transaction
        const queryTransaction = `
            INSERT INTO product_transaction(product_exp_id, transaction_type, quantity, note)
            VALUES($1, 'Tambah', $2, 'Pemasukan Produk Baru')
        `;

        const valuesTransaction = [result.rows[0].product_exp_id, result.rows[0].quantity];

        await pool.query(queryTransaction, valuesTransaction);

        // * Commit Transaction
        await pool.query('COMMIT');
    }catch(e){
        // * Rollback Transaction if error
        await pool.query('ROLLBACK');
        throw e;
    }
};

// * Delete product expired based on product_exp_id
async function deleteProductExp(productExpId, note){
    try{
        // * Begin transaction
        await pool.query('BEGIN');

        // * Ambil Nilai quantity dari product_exp sebelum di hapus
        const queryQuantity = `
            SELECT quantity
            FROM product_exp WHERE product_exp_id = $1;
        `;

        const valuesQuantity = [productExpId];

        const resultQuantity = await pool.query(queryQuantity, valuesQuantity);

        // * Hapus product_exp, set quantity menjadi 0
        const queryDelete = `
            UPDATE product_exp 
            SET quantity = 0, is_deleted = true
            WHERE product_exp_id = $1
        `;

        const valuesDelete = [productExpId];

        const resultDelete = await pool.query(queryDelete, valuesDelete);

        // * Check if delete was success
        if(resultDelete.rowCount === 0 ){
            throw new Error('Hapus product exp tidak berhasil');
        }

        // * After success delete product_exp, insert into product_transaction
        const queryInsert = `
            INSERT INTO product_transaction(product_exp_id, transaction_type, quantity, note)
            VALUES ($1, 'Kurang', $2, $3)
        `;

        const valuesInsert = [productExpId, resultQuantity.rows[0].quantity, note];

        await pool.query(queryInsert, valuesInsert);

        // * Commit transaction
        await pool.query('COMMIT');
    } catch(e){
        // * Rollback Transaction if error
        await pool.query('ROLLBACK');
        throw e;
    }
};

// * Update product expired based on product_exp_id
async function updateProductExp(quantity, productExpId, note){
    try{
        // * Begin Transaction
        await pool.query('BEGIN');

        // * Ambil Nilai quantity yang sekarang
        const queryQuantity = `
            SELECT 	quantity FROM product_exp WHERE product_exp_id = $1
        `;

        const valuesQuantity = [productExpId];

        const resultQuantity = await pool.query(queryQuantity,valuesQuantity);

        // * Update to add stock in product_exp
        const queryUpdate = `
            UPDATE product_exp SET quantity = $1
            WHERE product_exp_id = $2
            RETURNING quantity
        `;

        const valuesUpdate = [quantity, productExpId];

        const resultUpdate = await pool.query(queryUpdate, valuesUpdate);

        // * Check if update was success
        if(resultUpdate.rowCount === 0){
            throw new Error('Update failed');
        }
        
        // * Cek quantity yang dimasukkan
        if(resultQuantity.rows[0].quantity < resultUpdate.rows[0].quantity){
            // * Perhitungan Quantity sekarang dan quantity yang dimasukkan
            const quantityTambah = resultUpdate.rows[0].quantity - resultQuantity.rows[0].quantity;

            // * Jika quantity sekarang lebih kecil dari quantity yang dimasukkan, insert ke product_transaction dengan transaction_type 'Tambah'
            const queryInsert = `
                INSERT INTO product_transaction(product_exp_id, transaction_type, quantity, note)
                VALUES ($1, 'Tambah', $2, $3)
            `;

            const valuesInsert = [productExpId, quantityTambah, note];

            await pool.query(queryInsert, valuesInsert);
            console.log(quantityTambah);

        }else if(resultQuantity.rows[0].quantity > resultUpdate.rows[0].quantity){
            // * Perhitungan Quantity sekarang dan quantity yang dimasukkan
            const quantityKurang = resultQuantity.rows[0].quantity - resultUpdate.rows[0].quantity;

            // * Jika quantity sekarang lebih besar dari quantity yang dimasukkan, insert ke product_transaction dengan transaction_type 'Kurang'
            const queryInsert = `
                INSERT INTO product_transaction(product_exp_id, transaction_type, quantity, note)
                VALUES ($1, 'Kurang', $2, $3)
            `;

            const valuesInsert = [productExpId, quantityKurang, note];

            await pool.query(queryInsert, valuesInsert);
        }

        // * Commit transaction
        await pool.query('COMMIT');
    }catch(e){
        // * Rollback transaction if error
        await pool.query('ROLLBACK');
        throw e;
    }
};

module.exports = {
    getAllProductExp,
    addProductExp,
    deleteProductExp,
    updateProductExp
};