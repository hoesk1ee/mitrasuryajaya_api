const paymentModel = require('../model/payment_model');
const moment = require('moment');
require('moment/locale/id');

// * Controller to fetch payment by incoive id
async function getPayment(req,res){
    try{
        const { invoiceId } = req.params;

        const payment = await paymentModel.getPayment(invoiceId);
        
        if(payment.length == undefined){
            res.json({
                success : true,
                message : "Tidak ada timeline pembayaran!",
                invoice_id : payment.invoice_id,
                transaction_date : moment(payment.invoice_date).locale('id').format('DD MMMM YYYY HH:mm'),
                due_date : moment(payment.due_date).locale('id').format('DD MMMM YYYY HH:mm'),
                total_price : payment.total_price,
                total_payment : payment.total_payment,
                customer_name : payment.customer_name,
                customer_phone : payment.customer_phone
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil dapat data pembayaran!",
                invoice_id : payment[0].invoice_id,
                transaction_date : moment(payment[0].invoice_date).locale('id').format('DD MMMM YYYY HH:mm'),
                due_date : moment(payment[0].due_date).locale('id').format('DD MMMM YYYY HH:mm'),
                total_price : payment[0].total_price,
                total_payment : payment[0].total_payment,
                customer_name : payment[0].customer_name,
                customer_phone : payment[0].customer_phone,
                timeline : payment.map(({payment_date, amount_paid, note}) => 
                    ({payment_date : moment(payment_date).locale('id').format('DD MMMM YYYY HH:mm'), 
                        amount_paid, note}))
            });
        }
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Sever Error : ${e}`});
    }
};

// * Controller to add timeline payment
async function addTimelinePayment(req,res){
    try{
        const { invoiceId, amountPaid, note } = req.body;

        const timeline = await paymentModel.addTimelinePayment(invoiceId, amountPaid, note);

        if(timeline === false){
            res.json({
                success : false,
                message : "Tidak bisa menambahkan data waktu pembayaran karena total pembayaran lebih besar dari total harga!"
            });
        }else{
            res.status(201).json({ success : true,  message : "Waktu pembayaran berhasil ditambahkan!"});
        }
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to update paymnet based on payment_id
async function updatePayment(req,res){
    try{
        const { paymentId } = req.body;

        await paymentModel.updatePayment(paymentId);
        res.status(201).json({ success : true, message : "Pembayaran berhasil di verifikasi!"});
    }catch(e){
        console.error("Error : ", e);
        res.status(500).json({ success : false, message : "Pembayaran tidak berhasil diverifikasi"});
    }
};

module.exports = {
    getPayment,
    addTimelinePayment,
    updatePayment
};