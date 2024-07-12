const express = require('express');
const paymentController = require('../controller/payment_controller');
const router = express.Router();

// * Route endpoint to fetch payment based on invoice id
router.get('/:invoiceId', paymentController.getPayment);

// * Route endpoint to add timeline payment
router.post('/add-timeline', paymentController.addTimelinePayment);
module.exports = router;