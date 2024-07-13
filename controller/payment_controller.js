const paymentModel = require('../model/payment_model');
const moment = require('moment');
require('moment/locale/id');

// * Controller to fetch payment by incoive id
async function getPayment(req,res){
    try{
        const { invoiceId } = req.params;

        const payment = await paymentModel.getPayment(invoiceId);
        
        if(payment.length == 0){
            res.json({
                success : false,
                message : "No Timeline Payment!"
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil dapat data!",
                invoice_id : payment[0].invoice_id,
                transaction_date : payment[0].invoice_date,
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
        console.error('Error while fetching product expired : ', e);
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
                message : "Cannot add timeline payment because amount paid bigger than total price!"
            });
        }else{
            res.status(201).json({ success : true,  mesagge : "New Timeline payment has been added!"});
        }
    }catch(e){
        console.error("Error while adding new timeline payment : ", e);
        res.status(500).json({ success : false, message : `${e}`});
    }
};

module.exports = {
    getPayment,
    addTimelinePayment
};