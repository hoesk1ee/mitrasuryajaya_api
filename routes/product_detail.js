const express = require('express');
const productDetailController = require('../controller/product_detail_controller');
const router = express.Router();

// * Route endpoint to fetch all product detail based on product_id
router.get('/:productId', productDetailController.getAllProductDetail);

// * Route endpoint to add new product detail
router.post('/add-product-detail', productDetailController.addProductDetail);

// * Router endpoint to delete product detail based on product_id and product_detail_id
router.delete('/delete/:productId/:productDetailId', productDetailController.deleteProductDetail);

// * Router endpoint to update product detail based on product_id and product_detail_id
router.put('/update-product-detail', productDetailController.updateProductDetail);

module.exports = router;