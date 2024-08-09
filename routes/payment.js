const express = require('express');
const paymentController = require('../controller/payment_controller');
const router = express.Router();
const checkUserIdAndVerification = require('../middleware/checkUserId');

// * Route endpoint to fetch payment based on invoice id
router.get('/:invoiceId', checkUserIdAndVerification, paymentController.getPayment);

// * Route endpoint to add timeline payment
router.post('/add-timeline', checkUserIdAndVerification, paymentController.addTimelinePayment);

// * Route endpoint to update payment
router.put('/update-payment', checkUserIdAndVerification, paymentController.updatePayment);
module.exports = router;