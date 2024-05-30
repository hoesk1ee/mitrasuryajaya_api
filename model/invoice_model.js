const pool = require('../db/index');

// * Read All Invoice
async function getAllInvoice(){
    const query = `SELECT * FROM invoice`;
    const result = await pool.query(query);
    
    return result.rows;
};

module.exports = {
    getAllInvoice
};