const categoryModel = require('../model/category_model');

// * Controller to get all categories into json.
async function getAllCategories(req, res){
    try{
        const categories = await categoryModel.getAllCategories();

        if(categories.length == 0){
            res.json({
                success : false,
                message : "Tidak ada kategori di aplikasi ini"
            });
        }else{
            res.json(
                {
                    success : true,
                    message : "Berhasil dapat data kategori!",
                    categories : categories
                }
            );
        }
    } catch(e) {
        res.status(500).json({success: false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to take all variables
async function addCategory(req, res){
    try{
        const { categoryPic, categoryName } = req.body;

        await categoryModel.addCategory(categoryPic, categoryName);

        res.status(201).json({ success : true, message: "Kategori baru berhasil ditambahkan!"});
    } catch(e) {
        res.status(500).json({ success : false, message: `Internal Server Error : ${e}`});
    }
}

// * Controller to delete category based on ID
async function deleteCategory(req, res){
    try{
        const { categoryId } = req.params;

        await categoryModel.deleteCategory(categoryId);

        res.status(201).json({ success : true, message: "Data kategori berhasil dihapus!"});
    } catch(e){
        res.status(500).json({ success : false, message: `Internal Server Error : ${e}`});
    }
};

// * Controller to update category name and/or pic
async function updateCategory(req, res){
    try {
        const { categoryId, categoryPic, categoryName} = req.body;

        await categoryModel.updateCategory(categoryId, categoryPic, categoryName);

        res.status(201).json({ success : true, message: "Data kategori berhasil diubah!"});
    } catch(e){
        res.status(500).json({ success : false, message: `Internal Server Error : ${e}`});
    }
};

module.exports = {
    getAllCategories,
    addCategory,
    deleteCategory,
    updateCategory,
};