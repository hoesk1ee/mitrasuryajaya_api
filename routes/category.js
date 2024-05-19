const express = require('express');
const categoryController = require('../controller/category_controller');
const router = express.Router();

// * Route endpoint to fetch all categories
router.get('/', categoryController.getAllCategories);

// * Route endpoint to add new category
router.post('/add-category', categoryController.addCategory);

// * Route endpoint to delete category based on ID
router.delete('/delete-category/:categoryId', categoryController.deleteCategory);

// * Route endpoint to update category based on ID
router.put('/update-category', categoryController.updateCategory);

module.exports = router;