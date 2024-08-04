const userModel = require('../model/user_model');

// * Controller to req userId from frontend and give back data res
async function getUserById(req, res){

    try {
        const { userId } = req.params;

        const user = await userModel.getUserById(userId);

        if(user.length == 0){
            res.json({
                success : false,
                message : "Tidak ada user dengan ID ini!"
            });
        }else{
            res.json({
                success : true, 
                message : "Berhasil dapat data user!",
                user : user
            }); 
        }
    } catch(e) {
        res.status(500).json({
            success : false, 
            message : `Tidak berhasil mendapatkan data : ${e}`
        });
    }
};

// * Controller to get all user and send resp to frontend
async function getAllUser(req, res){
    try {
        const users = await userModel.getAllUser();

        if(users.length == 0){
            res.json({
                success : false,
                message : "Tidak ada user di aplikasi ini!"
            });
        }else{
            res.json({
                success : true, 
                message : "Berhasil dapat data user!",
                users : users
            });
        }
    } catch(e){
        res.status(500).json({
            success : false,
            message : `Tidak berhasil mendapatkan data user : ${e}`
        });
    }
}

// * Controller to receive req from frontend to add new user
async function createUser(req, res){
    try {
        let { userId, photoUrl, userRole, userName, phoneNumber, email } = req.body;

        if(photoUrl == null){
            photoUrl = 'https://firebasestorage.googleapis.com/v0/b/mitra-surya-jaya.appspot.com/o/user.png?alt=media&token=f005345b-2aba-4864-a25e-933bdd214a30';

            await userModel.createUser(userId, photoUrl, userRole, userName, phoneNumber, email);
        }else{
            await userModel.createUser(userId, photoUrl, userRole, userName, phoneNumber, email);

        }
        res.json({
            success : true,
            message : "User berhasil dibuat!",
        });
    } catch(e) {
        res.status(500).json({
            success : false,
            message : `Tidak berhasil membuat user : ${e}`,
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
                message : "User sudah di verifikasi!"
            });
        } else {
            res.json({
                success : true,
                message : "User sudah di verifikasi!",
            });
        }
    } catch(e) {
        res.status(500).json({
            success : false,
            message : `Tidak berhasil memverifikasi user ini : ${e}`
        });
   }
};

module.exports = {
    getUserById,
    getAllUser,
    createUser,
    updateUserVerification
};