const express = require('express');
const userController = require('../controller/user_controller');
const router = express.Router();

// * Route endpoint to retrieve user data based on ID
router.get('/:userId', userController.getUserById);

// * Route endpoint to create new user
router.post('/create-user', userController.createUser);

module.exports = router;