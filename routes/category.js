const express = require('express');
const categoryController = require('../controller/category_controller');
const router = express.Router();
const checkUserIdAndVerification = require('../middleware/checkUserId');

// * Route endpoint to fetch all categories
router.get('/', checkUserIdAndVerification, categoryController.getAllCategories);

// * Route endpoint to add new category
router.post('/add-category', checkUserIdAndVerification, categoryController.addCategory);

// * Route endpoint to delete category based on ID
router.post('/delete-category/:categoryId', checkUserIdAndVerification, categoryController.deleteCategory);

// * Route endpoint to update category based on ID
router.put('/update-category', checkUserIdAndVerification, categoryController.updateCategory);

module.exports = router;