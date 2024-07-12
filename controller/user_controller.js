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
};

// * Controller to get all user and send resp to frontend
async function getAllUser(req, res){
    try {
        const users = await userModel.getAllUser();

        res.json({
            success : true, 
            users : users,
        });
    } catch(e){
        console.error("Failed to retrieve user data : ", e);
        res.status(500).json({
            success : false,
            message : `Failed to retreive user data : ${3}`,
        });
    }
}

// * Controller to receive req from frontend to add new user
async function createUser(req, res){
    try {
        let { userId, photo_url, userRole, userName, phoneNumber, email } = req.body;

        if(photo_url == null){
            photo_url = 'https://firebasestorage.googleapis.com/v0/b/mitra-surya-jaya.appspot.com/o/user.png?alt=media&token=6c53cb9c-975a-48ff-8d1a-da3ca2dc6dc6';

            await userModel.createUser(userId, photo_url, userRole, userName, phoneNumber, email);
        }else{
            await userModel.createUser(userId, photo_url, userRole, userName, phoneNumber, email);

        }
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
};

// * Controller to receive userId to update verification status
async function updateUserVerification(req, res){
    const { userId } = req.params;
    
   try{
        const result = await userModel.updateUserVerification(userId);
        
        if(result){
            res.json({
                success : false,
                message : "User already verified!"
            });
        } else {
            res.json({
                success : true,
                message : "User has been verified!",
            });
        }
    } catch(e) {
        console.error("Failed to verif user : ", e);
        res.status(500).json({
            success : false,
            message : `Failed to verif current user : ${e}`,
        });
   }
};

module.exports = {
    getUserById,
    getAllUser,
    createUser,
    updateUserVerification
};