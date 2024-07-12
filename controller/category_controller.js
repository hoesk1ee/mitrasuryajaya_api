const categoryModel = require('../model/category_model');

// * Controller to get all categories into json.
async function getAllCategories(req, res){
    try{
        const categories = await categoryModel.getAllCategories();

        if(categories.length == 0){
            res.json({
                success : false,
                message : "No Category"
            });
        }else{
            res.json(
                {
                    success : true,
                    categories : categories
                }
            );
        }
    } catch(e) {
        console.error('Error fetching categories data : ', e);
        res.status(500).json({success: false, error : "Internal Server Error : ", e});
    }
};

// * Controller to take all variables
async function addCategory(req, res){
    try{
        const { categoryPic, categoryName } = req.body;

        await categoryModel.addCategory(categoryPic, categoryName);

        res.status(201).json({ success : true, message: "New category has been added!"});
    } catch(e) {
        console.error('Error while adding new category : ', e);
        res.status(500).json({ success : false, message: `${e}`});
    }
}

// * Controller to delete category based on ID
async function deleteCategory(req, res){
    try{
        const { categoryId } = req.params;

        await categoryModel.deleteCategory(categoryId);

        res.status(201).json({ success : true, message: "Category has been deleted!"});
    } catch(e){
        console.error("Error while deleting category : ", e);
        res.status(500).json({ success : false, message: `${e}`});
    }
};

// * Controller to update category name and/or pic
async function updateCategory(req, res){
    try {
        const { categoryId, categoryPic, categoryName} = req.body;

        await categoryModel.updateCategory(categoryId, categoryPic, categoryName);

        res.status(201).json({ success : true, message: "Category has been updated!"});
    } catch(e){
        console.error("Error while updating category : ", e);
        res.status(500).json({ success : false, message: `${e}`});
    }
};

module.exports = {
    getAllCategories,
    addCategory,
    deleteCategory,
    updateCategory,
};