const express =  require('express');
const productTransactionController = require('../controller/product_transaction_controller');
const router = express.Router();
const checkUserIdAndVerification = require('../middleware/checkUserId');

// * Router endpoint to fetch product transaction based on transaction type = 'Tambah'
router.get('/get-add-product-transaction', checkUserIdAndVerification, productTransactionController.getAddProductTransaction);

// * Router endpoint to fetch product transaction based on transaction_type = 'Kurang'
router.get('/get-reduce-product-transaction', checkUserIdAndVerification, productTransactionController.getReduceProductTransaction);

// * Router endpoint to fetch product based on product_exp_id
router.get('/get-product-transaction/:productExpId', checkUserIdAndVerification, productTransactionController.getTransactionByProductExpId);

// * Router endpoint to fetch all list product
router.get('/get-list-product', checkUserIdAndVerification, productTransactionController.getProductList);
module.exports = router;