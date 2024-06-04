const express = require('express');
const invoiceController = require('../controller/invoice_controller');
const router = express.Router();

// * Router endpoint to fetch all invoice
router.get('/', invoiceController.getAllInvoice);

// * Router endpoint to add new invoice
router.post('/add-invoice', invoiceController.addInvoice);

// * Router endpoint to fetch invoice based on customerId
router.get('/:customerId', invoiceController.getInvoiceByCustomerId);

module.exports = router;