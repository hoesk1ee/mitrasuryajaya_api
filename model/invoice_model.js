const pool = require('../db/index');

// * Read All Invoice
async function getAllInvoice(){
    const query = `
        SELECT 
            i.invoice_id, i.invoice_date, i.due_date, i.invoice_type, i.total_price, i.user_id,
            u.user_name, i.customer_id, c.customer_name, 
            SUM(ii.quantity) AS total_item,
	        (SELECT SUM(amount_paid) AS total_payment FROM payments WHERE invoice_id = i.invoice_id)
        FROM invoice i 
        LEFT JOIN customers c ON i.customer_id = c.customer_id
        LEFT JOIN invoice_item ii ON i.invoice_id = ii.invoice_id
		JOIN users u ON i.user_id = u.user_id
        GROUP BY i.invoice_id, c.customer_id, u.user_id
    `;
    const result = await pool.query(query);
    
    return result.rows;
};

// * Add invoice, after success delete product from cart
async function addInvoice(customerId, invoiceType, totalPrice, userId){
    try{
        // * Begin transaction
        await pool.query('BEGIN');

        // * Insert to table invoice
        const queryInsertInvoice = `
            INSERT INTO invoice(customer_id, due_date, invoice_type, total_price, user_id)
                VALUES (
                    $1, 
                    NOW() + INTERVAL '60 days', 
                    $2, 
                    $3,
                    $4
                )
                RETURNING invoice_id
        `;

        const valuesInsert = [customerId, invoiceType, totalPrice, userId];

        const insertInvoice = await pool.query(queryInsertInvoice, valuesInsert);
        
        // * Insert to Invoice Item
        const queryInsertInvoiceItem = `
            INSERT INTO invoice_item(invoice_id, product_exp_id, quantity)
                SELECT 
                    $1,
                    product_exp_id, 
                    quantity
                FROM 
                    cart
                WHERE
                    user_id = $2;
        `;

        const insertItemValues = [insertInvoice.rows[0].invoice_id, userId];

        await pool.query(queryInsertInvoiceItem, insertItemValues);
    
        // * Delete product from cart
        const queryDelete = `
            DELETE FROM cart WHERE user_id = $1;
        `;
    
        const valueDelete = [userId];
    
        await pool.query(queryDelete, valueDelete);
    
        // * Commit transaction
        await pool.query('COMMIT');
    }catch(e){
        // * Rollback transaction if error
        await pool.query('ROLLBACK');
        throw e;
    }
};

// * Read Invoice By customer_id
async function getInvoiceByCustomerId(customerId){
    try{
        // Begin Transaction
        await pool.query('BEGIN');

        // * Get Customer based on Customer ID
        const queryGetCustomer = 
            `SELECT 
                c.customer_id, c.customer_name, c.customer_phone, c.customer_address,
                SUM(COALESCE((i.total_price - (SELECT SUM(amount_paid) AS total_payment FROM payments WHERE invoice_id = i.invoice_id)), 0)) AS total_bill
            FROM customers c 
            LEFT JOIN invoice i ON c.customer_id = i.customer_id
            WHERE c.customer_id = $1
            GROUP BY c.customer_id
        `;

        const valuesGetCustomer = [customerId];

        const resultGetCustomer = await pool.query(queryGetCustomer,valuesGetCustomer);

        // * Get Invoice based on Customer ID
        const queryGetInvoice = 
            `SELECT 
                i.invoice_id, i.invoice_date, i.due_date, i.invoice_type, i.total_price, i.user_id,
                u.user_name, SUM(ii.quantity) AS total_item,
                (SELECT SUM(amount_paid) AS total_payment FROM payments WHERE invoice_id = i.invoice_id)
            FROM invoice i 
            LEFT JOIN customers c ON i.customer_id = c.customer_id
            LEFT JOIN invoice_item ii ON i.invoice_id = ii.invoice_id
            JOIN users u ON i.user_id = u.user_id
            WHERE i.customer_id = $1
            GROUP BY i.invoice_id, c.customer_id, u.user_id
        `;

        const valuesGetInvoice = [customerId];

        const resultGetInvoice = await pool.query(queryGetInvoice, valuesGetInvoice);

        // * Commint Transaction
        await pool.query('COMMIT');

        return  { 
            customer_id: resultGetCustomer.rows[0].customer_id,
            customer_name : resultGetCustomer.rows[0].customer_name,
            customer_phone : resultGetCustomer.rows[0].customer_phone,
            customer_address : resultGetCustomer.rows[0].customer_address,
            total_bill : resultGetCustomer.rows[0].total_bill, 
            listInvoice : resultGetInvoice.rows
        };
    }catch(e){
        // * Rollback Transacion if error
        await pool.query('ROLLBACK');
        throw e;
    }
};

// * Read Invoice by userId
async function getInvoiceByUserId(userId){
    const query = `SELECT * FROM invoice WHERE user_id = $1`;

    const values = [userId];

    const result = await pool.query(query, values);

    return result.rows;
};

// * Read invoice item based on invoice_id
async function getInvoiceItemByInvoiceId(invoiceId){
    const query = `
        SELECT ii.*, i.*, pd.*,
            c.customer_name, u.user_name, p.product_name, pd.price,
            (SELECT SUM(amount_paid) AS total_payment FROM payments WHERE invoice_id = ii.invoice_id) 
        FROM invoice_item ii 
        JOIN invoice i ON ii.invoice_id = i.invoice_id
        LEFT JOIN customers c ON i.customer_id = c.customer_id
        JOIN users u ON i.user_id = u.user_id
        JOIN product_exp pe ON ii.product_exp_id = pe.product_exp_id
        JOIN product_detail pd ON pe.product_detail_id = pd.product_detail_id
        JOIN products p ON pd.product_id = p.product_id
        WHERE ii.invoice_id = $1
    `;

    const values = [invoiceId];

    const result = await pool.query(query, values);

    return result.rows;
};

// * Read Invoice based on Invoice Type
async function getInvoiceByType(){
    const query = `
        SELECT * FROM invoice
        WHERE invoice_type = 'piutang' AND customer_id IS NULL
    `;

    const result = await pool.query(query);

    return result.rows;
};

// * Update customer ID based on invoice ID
async function updateCustByInvoiceId(customerId, invoiceId){
    const query = `UPDATE invoice SET customer_id = $1 WHERE invoice_id = $2`;

    const values = [customerId, invoiceId];

    await pool.query(query, values);
};

module.exports = {
    getAllInvoice,
    addInvoice,
    getInvoiceByCustomerId,
    getInvoiceByUserId,
    getInvoiceItemByInvoiceId,
    getInvoiceByType,
    updateCustByInvoiceId
};