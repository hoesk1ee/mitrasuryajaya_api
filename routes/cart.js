const express = require('express');
const cartController = require('../controller/cart_controller');
const router = express.Router();

// * Router endpoint to get data cart
router.get('/:userId', cartController.getAllCart);

// * Router endpoint to add new cart
router.post('/add-cart', cartController.addCart);

// * Router endpoint to delete cart based on userId and productExpId
router.delete('/delete-cart/:userId/:productExpId', cartController.deleteCart);

module.exports = router;