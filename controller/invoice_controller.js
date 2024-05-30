const invoiceModel = require('../model/invoice_model');

// * Controller to fetch invoice by customerId
async function getAllInvoice(req,res){
    try{
        const invoice = await invoiceModel.getAllInvoice();

        if(invoice.length == 0){
            res.json({
                success : true,
                message : "No invoice"
            });
        }else{
            res.json({
                success : true,
                invoice : invoice
            });
        }
    }catch(e){
        console.error("Error fetching invoices data : ", e);
        res.status(500).json({ success : false, message : `Internal Server Error : ${e} `});
    }
};

module.exports = {
    getAllInvoice
};