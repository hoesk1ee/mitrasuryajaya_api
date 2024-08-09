const express = require('express');
const userController = require('../controller/user_controller');
const router = express.Router();
const checkUserIdAndVerification = require('../middleware/checkUserId');

// * Route endpoint to retrieve all user data
router.get('/', checkUserIdAndVerification, userController.getAllUser);

// * Route endpoint to retrieve user data based on ID
router.get('/:userId', userController.getUserById);

// * Route endpoint to create new user
router.post('/create-user', userController.createUser);

// * Route endpoint to update verification status of user
router.put('/update-user-verification/:userId', checkUserIdAndVerification, userController.updateUserVerification);

module.exports = router;