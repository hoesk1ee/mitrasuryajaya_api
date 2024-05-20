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

module.exports = {
    getUserById,
};