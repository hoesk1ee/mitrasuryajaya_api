const express = require('express');
const productExpController = require('../controller/product_exp_controller');
const router = express.Router();

// * Router endpoint to get all product expired based on product_detail_id
app.use('/:productDetailId', productExpController.getAllProductExp);

module.exports = router;