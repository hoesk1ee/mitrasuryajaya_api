const invoiceModel = require('../model/invoice_model');

// * Controller to fetch invoice
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

// * Controller to add new invoice
async function addInvoice(req,res){
    try{
        const { customerId, invoiceType, totalPrice, userId } = req.body;

        await invoiceModel.addInvoice(customerId, invoiceType, totalPrice, userId);
        res.status(201).json({ success : true, message : "New invoice has been added!"});
    }catch(e){
        console.error("Error while adding new invoice : ", e);
        res.status(500).json({ success : false, message : `${e}`});
    }
};

module.exports = {
    getAllInvoice,
    addInvoice
};