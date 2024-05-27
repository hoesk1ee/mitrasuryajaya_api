const express = require('express');
const cartController = require('../controller/cart_controller');
const router = express.Router();

// * Router endpoint to get data cart
router.get('/:userId', cartController.getAllCart);

// * Router endpoint to add new cart
router.post('/add-cart', cartController.addCart);

module.exports = router;