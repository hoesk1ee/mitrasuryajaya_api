const userModel = require('../model/user_model');

// * Controller to req userId from frontend and give back data res
async function getUserById(req, res){
    const { userId } = req.params;

    try {
        const user = await userModel.getUserById(userId);

        res.json({
            success : true, 
            user : user
    }); 
    } catch(e) {
        console.error('Failed to retrieve user data : ', e);
        res.status(500).json({
            success : false, 
            message : "Failed to retrieve user data : ", e,
        });
    }
}

// * Controller to receive req from frontend to add new user
async function createUser(req, res){
    const { userId, photoUrl, userRole, userName, phoneNumber, email, isVerified } = req.body;

    try {
        const newUser = await userModel.createUser(userId, photoUrl, userRole, userName, phoneNumber, email, isVerified);

        res.json({
            success : true,
            message : "User has been created!",
        });
    } catch(e) {
        console.error("Failed to create new user : ", e);
        res.status(500).json({
            success : false,
            message : `Failed to create new user : ${e}`,
        });
    }
}

module.exports = {
    getUserById,
    createUser,
};