const pool = require('../db/index');

// * Read all payment
async function getPayment(invoiceId){
    const query = `
            SELECT 
                p.invoice_id, i.invoice_date, i.total_price, p.payment_date, p.amount_paid, p.note
            FROM payments p JOIN invoice i ON p.invoice_id = i.invoice_id
            WHERE p.invoice_id = $1`;
    
    const values = [invoiceId];

    const result = await pool.query(query, values);

    return result.rows;
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
        if(sumAmountPaid  >= resultGetTotalPrice.rows[0].total_price){
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