const pool = require('../db/index');

// * Read All Invoice
async function getAllInvoice(){
    const query = `
        SELECT 
            i.*, 
            c.customer_name,
            COUNT(ii.quantity) AS total_item 
        FROM invoice i 
        JOIN customers c ON i.customer_id = c.customer_id
        LEFT JOIN invoice_item ii ON i.invoice_id = ii.invoice_id 
        GROUP BY i.invoice_id, c.customer_id
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
    const query = `SELECT * FROM invoice WHERE customer_id = $1`;

    const values = [customerId];

    const result = await pool.query(query, values);

    return result.rows;
};

// * Read Invoice by userId
async function getInvoiceByUserId(userId){
    const query = `SELECT * FROM invoice WHERE user_id = $1`;

    const values = [userId];

    const result = await pool.query(query, values);

    return result.rows;
};

module.exports = {
    getAllInvoice,
    addInvoice,
    getInvoiceByCustomerId,
    getInvoiceByUserId
};