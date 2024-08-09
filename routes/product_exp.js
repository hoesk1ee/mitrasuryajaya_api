const express = require('express');
const productExpController = require('../controller/product_exp_controller');
const router = express.Router();
const checkUserIdAndVerification = require('../middleware/checkUserId');

// * Router endpoint to fetch all product expired based on product_detail_id
router.get('/:productDetailId', checkUserIdAndVerification, productExpController.getAllProductExp);

// * Router endpoint to add new product expired
router.post('/add-product-exp', checkUserIdAndVerification, productExpController.addProductExp);

// * Router endpoint to delete product expired
router.post('/delete-product-exp', checkUserIdAndVerification, productExpController.deleteProductExp);

// *Router endpoint to update stock in product expired
router.post('/update-product-exp', checkUserIdAndVerification, productExpController.updateProductExp);

module.exports = router;