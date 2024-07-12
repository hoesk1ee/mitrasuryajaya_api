const express = require('express');
const invoiceController = require('../controller/invoice_controller');
const router = express.Router();

// * Router endpoint to fetch all invoice
router.get('/', invoiceController.getAllInvoice);

// * Router endpoint to add new invoice
router.post('/add-invoice', invoiceController.addInvoice);

// * Router endpoint to fetch invoice based on customerId
router.get('/customer-invoice/:customerId', invoiceController.getInvoiceByCustomerId);

// * Router endpoint to fetch invoice based on userId
router.get('/:userId', invoiceController.getInvoiceByUserId);

// * Router endpoint to fetch invoice item based on invoiceId
router.get('/invoice-item/:invoiceId', invoiceController.getInvoiceItemByInvoiceId);

// * Router endpoint to fetch invoice based on invoice type where invoice type = 'piutang' and customer is null
router.get('/invoice-type/piutang', invoiceController.getInvoiceByType);

// * Router endpoint to update customer ID based on invoice ID
router.put('/update-invoice', invoiceController.updateCustByInvoiceId);

module.exports = router;