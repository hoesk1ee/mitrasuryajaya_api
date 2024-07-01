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

// * Controller to fetch invoice based on customer_id
async function getInvoiceByCustomerId(req,res){
    try{
        const { customerId } = req.params;

        const invoice = await invoiceModel.getInvoiceByCustomerId(customerId);

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
        console.error("Error fetching invoice based on customer_id : ", e);
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to fetch invoice based on userId
async function getInvoiceByUserId(req,res){
    try{
        const {userId} = req.params;

        const invoice = await invoiceModel.getInvoiceByUserId(userId);

        if(invoice.length == 0){
            res.json({
                success : true,
                message : "No Invoice"
            });
        }else{
            res.json({
                success : true,
                invoice : invoice 
            });
        }
    }catch(e){
        console.error("Error while fetching invoice based on userId : ", e);
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to fetch invoice item based on invoice_id
async function getInvoiceItemByInvoiceId(req,res){
    try{
        const {invoiceId} = req.params;

        const invoiceItem = await invoiceModel.getInvoiceItemByInvoiceId(invoiceId);

        if(invoiceItem.length == 0)
            {
                res.json({
                    success : true,
                    message : "No Invoice"
                });
            }else{
                res.json({
                    success : true,
                    invoice_id : invoiceItem[0].invoice_id,
                    invoice_date : invoiceItem[0].invoice_date,
                    due_date : invoiceItem[0].due_date,
                    invoice_type : invoiceItem[0].invoice_type,
                    total_price : invoiceItem[0].total_price,
                    customer_id : invoiceItem[0].customer_id,
                    customer_name : invoiceItem[0].customer_name,
                    user_id : invoiceItem[0].user_id,
                    user_name : invoiceItem[0].user_name,
                    invoice_item : invoiceItem.map(
                        ({invoice_item_id, product_exp_id, quantity, product_name, product_detail_id, product_detail_name, product_detail_pic, price}) =>
                            ({invoice_item_id, product_exp_id, quantity, product_name, product_detail_id, product_detail_name, product_detail_pic, price})
                    )
                });
            }
    }catch(e){
        console.error("Error while fetching invoice : ", e);
        res.status(500).json({ success : false, message : `Interval Server Error : ${e}`});
    }
};

module.exports = {
    getAllInvoice,
    addInvoice, 
    getInvoiceByCustomerId,
    getInvoiceByUserId,
    getInvoiceItemByInvoiceId
};