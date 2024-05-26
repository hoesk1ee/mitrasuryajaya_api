const express = require('express');
const productExpController = require('../controller/product_exp_controller');
const router = express.Router();

// * Router endpoint to fetch all product expired based on product_detail_id
router.get('/:productDetailId', productExpController.getAllProductExp);

// * Router endpoint to add new product expired
router.post('/add-product-exp', productExpController.addProductExp);

// * Router endpoint to delete product expired
router.post('/delete-product-exp', productExpController.deleteProductExp);

module.exports = router;