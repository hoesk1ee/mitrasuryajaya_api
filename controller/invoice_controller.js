const invoiceModel = require('../model/invoice_model');

// * Controller to fetch invoice
async function getAllInvoice(req,res){
    try{
        const invoice = await invoiceModel.getAllInvoice();

        if(invoice.length == 0){
            res.json({
                success : false,
                message : "Tidak ada invoice di aplikasi ini!"
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil dapat data invoice!",
                invoice : invoice
            });
        }
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e} `});
    }
};

// * Controller to add new invoice
async function addInvoice(req,res){
    try{
        const { product_exp_id, customerId, invoiceType, totalPrice, userId, transactionType, note } = req.body;

        await invoiceModel.addInvoice(product_exp_id, customerId, invoiceType, totalPrice, userId, transactionType, note);
        res.status(201).json({ success : true, message : "Invoice baru berhasil ditambahkan!"});
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to fetch invoice based on customer_id
async function getInvoiceByCustomerId(req,res){
    try{
        const { customerId } = req.params;

        const invoice = await invoiceModel.getInvoiceByCustomerId(customerId);

        if(invoice.length == 0){
            res.json({
                success : false,
                message : "Tidak ada invoice dengan customer ID ini!"
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil dapat data invoice dengan customer ID ini!",
                customer_id : invoice.customer_id,
                customer_name : invoice.customer_name,
                customer_phone : invoice.customer_phone,
                customer_address : invoice.customer_address,
                total_bill : invoice.total_bill,
                invoice: invoice.listInvoice
            });
        }
    }catch(e){
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
                success : false,
                message : "Tidak ada invoice dengan invoice ID ini!"
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil dapat data invoice dengan invoice ID ini!",
                invoice : invoice 
            });
        }
    }catch(e){
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
                    success : false,
                    message : "Tidak ada invoice item dengan invoice ID ini!"
                });
            }else{
                res.json({
                    success : true,
                    message : "Berhasil dapat data invoice item dengan invoice ID ini!",
                    invoice_id : invoiceItem[0].invoice_id,
                    invoice_date : invoiceItem[0].invoice_date,
                    due_date : invoiceItem[0].due_date,
                    invoice_type : invoiceItem[0].invoice_type,
                    total_price : invoiceItem[0].total_price,
                    total_payment : invoiceItem[0].total_payment,
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
        res.status(500).json({ success : false, message : `Interval Server Error : ${e}`});
    }
};

// * Controller to fetch invoice based on invoice type
async function getInvoiceByType(req,res){
    try{
        const invoiceType = await invoiceModel.getInvoiceByType();

        if(invoiceType.length == 0){
            res.json({
                success : false,
                message : "Tidak ada invoice dengan tipe piutang!"
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil dapat data invoice dengan tipe piutang!",
                invoice : invoiceType
            });
        }
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to update customer ID based on invoice ID
async function updateCustByInvoiceId(req, res){
    try{
        const { customerId, invoiceId } = req.body;

        await invoiceModel.updateCustByInvoiceId(customerId, invoiceId);
        res.status(201).json({ success : true, message : "Customer ID berhasil diubah!"});
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
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