const express = require('express');
const cartController = require('../controller/cart_controller');
const router = express.Router();
const checkUserIdAndVerification = require('../middleware/checkUserId');

// * Router endpoint to get data cart
router.get('/:userId', checkUserIdAndVerification, cartController.getAllCart);

// * Router endpoint to add new cart
router.post('/add-cart', checkUserIdAndVerification, cartController.addCart);

// * Router endpoint to delete cart based on userId and productExpId
router.delete('/delete-cart/:userId/:productExpId', checkUserIdAndVerification, cartController.deleteCart);

// * Router endpoint to update cart based on cart_id and userId
router.put('/update-quantity', checkUserIdAndVerification, cartController.updateCart);

module.exports = router;