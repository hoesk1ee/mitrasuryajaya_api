const express = require('express');
const cartController = require('../controller/cart_controller');
const router = express.Router();

// * Router endpoint to get data cart
router.get('/:userId', cartController.getAllCart);

module.exports = router;