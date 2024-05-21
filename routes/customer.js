const express = require('express');
const customerController = require('../controller/customer_controller');
const router = express.Router();

// * Route endpoint to fetch all customer
router.get('/', customerController.getAllCustomers);

// * Route endpoint to fetch customer based on id
router.get('/:customerId', customerController.getCustomerById);

// * Route endpoint to add customer
router.post('/add-customer', customerController.addCustomer);

// * Route endpoint to delete customer based on Id
router.delete('/delete-customer/:customerId', customerController.deleteCustomer);

// * Route endpoint to update customer based on id
router.put('/update-customer', customerController.updateCustomer);

module.exports = router;