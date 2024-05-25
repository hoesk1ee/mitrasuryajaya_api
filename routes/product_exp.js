const express = require('express');
const productExpController = require('../controller/product_exp_controller');
const router = express.Router();

// * Router endpoint to fetch all product expired based on product_detail_id
router.get('/:productDetailId', productExpController.getAllProductExp);

module.exports = router;