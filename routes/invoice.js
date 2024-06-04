const express = require('express');
const invoiceController = require('../controller/invoice_controller');
const router = express.Router();

// * Router endpoint to fetch invoice by customerId
router.get('/', invoiceController.getAllInvoice);

// * Router endpoint to add new invoice
router.post('/add-invoice', invoiceController.addInvoice);

module.exports = router;