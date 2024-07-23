const pool = require('../db/index');

// * Read all payment
async function getPayment(invoiceId){
    try{
        // * Begin Transaction
        await pool.query('BEGIN');

        const query = `
            SELECT 
                p.invoice_id, i.invoice_date, i.due_date, i.total_price, p.payment_date, p.amount_paid, p.note,
                c.customer_phone, c.customer_name, 
                COALESCE((SELECT SUM(amount_paid) AS total_amount_paid FROM payments WHERE invoice_id = $1), 0) AS total_payment
            FROM payments p JOIN invoice i ON p.invoice_id = i.invoice_id
            JOIN customers c ON i.customer_id = c.customer_id
            WHERE p.invoice_id = $2
        `;
        
        const values = [invoiceId, invoiceId];

        const result = await pool.query(query, values);

        // * Jika tidak ada timeline, maka hanya menampilkan data invoice dan customernya
        if(result.rows.length == 0){
            const queryGet = `
                SELECT 
                    i.invoice_id, i.invoice_date, i.due_date, i.total_price,
                    c.customer_name, c.customer_phone,
                    COALESCE((SELECT SUM(amount_paid) AS total_amount_paid FROM payments WHERE invoice_id = $1), 0) AS total_payment
                FROM invoice i 
                JOIN customers c ON i.customer_id = c.customer_id
                WHERE i.invoice_id = $2
            `;

            const valuesGet = [invoiceId, invoiceId];

            const resultGet = await pool.query(queryGet, valuesGet);

            return{
                invoice_id : resultGet.rows[0].invoice_id,
                invoice_date : resultGet.rows[0].invoice_date,
                due_date : resultGet.rows[0].due_date,
                total_price : resultGet.rows[0].total_price,
                customer_name : resultGet.rows[0].customer_name,
                customer_phone : resultGet.rows[0].customer_phone,
                total_payment : resultGet.rows[0].total_payment
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

// * Add Timeline Payment
async function addTimelinePayment(invoiceId,amountPaid,note){
    try{
        // * Begin Transaction
        await pool.query('BEGIN');

        // * Get SUM Amount Paid from database
        const querySumAmountPaid = `SELECT SUM(amount_paid) AS amount_paid FROM payments WHERE invoice_id = $1`;

        const valueSumAmountPaid = [invoiceId];
        const resultSumAmountPaid = await pool.query(querySumAmountPaid, valueSumAmountPaid);

        // * Jumlahkan sum amount paid dari database dan amountPaid yang diinput
        const sumAmountPaid = parseFloat(resultSumAmountPaid.rows[0].amount_paid) + parseFloat(amountPaid);

        // * Get Total Price from database
        const queryGetTotalPrice = `SELECT total_price FROM invoice WHERE invoice_id = $1`;

        const valuesGetTotalPrice = [invoiceId];
        const resultGetTotalPrice = await pool.query(queryGetTotalPrice, valuesGetTotalPrice);

        // * Check if SUM Amount Paid > Total Price, cannot add timeline payment
        if(sumAmountPaid  > resultGetTotalPrice.rows[0].total_price){
           return false;
        }else{
             // * Insert Timeline Payment
             const queryInsert = `
                INSERT INTO payments(invoice_id, payment_date, amount_paid, note)
                VALUES($1, CURRENT_TIMESTAMP, $2, $3)`;
 
             const valuesInsert = [invoiceId, amountPaid, note];
 
             await pool.query(queryInsert,valuesInsert);
        }

        // * Commit Transaction
        await pool.query('COMMIT');
    }catch(e){
        // * Rollback Transacion if error
        await pool.query('ROLLBACK');
        throw e;
    }
};

module.exports = {
    getPayment,
    addTimelinePayment
};