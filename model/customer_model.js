const pool = require('../db/index');

// * Read All Customers
async function getAllCustomers(){
    const query = `
        SELECT 
            c.customer_name, c.customer_phone, c.customer_address,
            SUM(COALESCE((i.total_price - (SELECT SUM(amount_paid) AS total_payment FROM payments WHERE invoice_id = i.invoice_id)), 0)) AS total_bill
        FROM customers c 
        LEFT JOIN invoice i ON c.customer_id = i.customer_id
        GROUP BY c.customer_id
    `;
    const result = await pool.query(query);

    return result.rows;
};

// * Read Customer by ID
async function getCustomerById(customerId){
    const query = `SELECT * FROM customers WHERE customer_id = $1`;
    
    const values = [customerId];

    const result = await pool.query(query, values);

    return result.rows[0];
};

// * Add new Customer to database
async function addCustomer(customerName, customerPhone, customerAddress){
    const query = `
        INSERT INTO customers (customer_name, customer_phone, customer_address)
        VALUES 
        ($1, $2, $3)`;

    const values = [customerName, customerPhone, customerAddress];

    await pool.query(query, values);
};

// * Delete customer Based on ID
async function deleteCustomer(customerId){
    const query = `DELETE FROM customers WHERE customer_id = $1`;

    const values = [customerId];

    await pool.query(query, values);
};

// * Update Customer Based on ID
async function updateCustomer(customerId, customerName, customerPhone, customerAddress){
    let query = `UPDATE customers SET`;

    const values = [];
    let valueIndex = 1;
    let fieldstoUpdate = 0;

    if(customerName !== undefined){
        query += ` customer_name = $${valueIndex}`;
        values.push(customerName);
        valueIndex++;
        fieldstoUpdate++;
    }

    if(customerPhone !== undefined){
        if(fieldstoUpdate > 0){
            query += ',';
        }

        query += ` customer_phone = $${valueIndex}`;
        values.push(customerPhone);
        valueIndex++;
        fieldstoUpdate++;
    }

    if(customerAddress !== undefined){
        if(fieldstoUpdate > 0){
            query += ',';
        }

        query += ` customer_address = $${valueIndex}`;
        values.push(customerAddress);
        valueIndex++;
        fieldstoUpdate++;
    }

    if(fieldstoUpdate > 0){
        query += ` WHERE customer_id = $${valueIndex}`;
        values.push(customerId);

        await pool.query(query, values);
    }else{
        throw new Error('No Fields to Update');
    }
};


module.exports = {
    getAllCustomers,
    getCustomerById,
    addCustomer,
    deleteCustomer,
    updateCustomer
};