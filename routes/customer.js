const express = require('express');
const customerController = require('../controller/customer_controller');
const router = express.Router();
const checkUserIdAndVerification = require('../middleware/checkUserId');

// * Route endpoint to fetch all customer
router.get('/', checkUserIdAndVerification, customerController.getAllCustomers);

// * Route endpoint to fetch customer based on id
router.get('/:customerId', checkUserIdAndVerification, customerController.getCustomerById);

// * Route endpoint to add customer
router.post('/add-customer', checkUserIdAndVerification, customerController.addCustomer);

// * Route endpoint to delete customer based on Id
router.delete('/delete-customer/:customerId', checkUserIdAndVerification, customerController.deleteCustomer);

// * Route endpoint to update customer based on id
router.put('/update-customer', checkUserIdAndVerification, customerController.updateCustomer);

module.exports = router;