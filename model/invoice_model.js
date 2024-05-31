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



module.exports = {
    getAllInvoice
};