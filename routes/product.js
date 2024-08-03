const express = require('express');
const productController = require('../controller/product_controller');
const router = express.Router();

//  * Route endpoint to fetch all product based on category_id
router.get('/:categoryId', productController.getAllProduct);

// * Route endpoint to add new product
router.post('/add-product', productController.addProduct);

// * Route endpoint to delete product based product_id and category_id
router.post('/delete-product', productController.deleteProduct);

// * Route endpoint to update pic and/or name product based on product_id and category_id
router.put('/update-product', productController.updateProduct);

module.exports = router;