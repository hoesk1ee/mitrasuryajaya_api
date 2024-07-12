const productModel = require('../model/product_model');

// * Controller to get All product based on category id
async function getAllProduct(req, res){
    try{
        const { categoryId } = req.params;

        const products = await productModel.getAllProduct(categoryId);
        
        if( products.length == 0 ){
            res.json({
                success : false,
                message : "No Product in this category"
            });
        }else{
            res.json({
                success : true,
                products : products
            });
        }
        
    } catch(e){
        console.error('Error fetching products data : ', e);
        res.status(500).json({ success: false, error : "Internal Server Error", e});
    }
};

// * Controller to add new product
async function addProduct(req, res){
    try{
        const { categoryId, productPic, productName } = req.body;

        await productModel.addProduct(categoryId, productPic, productName);

        res.status(201).json({ success : true, message : "Product has been added!"});
    } catch(e){
        console.error("Error while adding product : ", e);
        res.status(500).json({ success : false, message : `${e}`});
    }
};

// * Controller to delete product based on product id and category id
async function deleteProduct(req,res){
    try{
        const { productId, categoryId } = req.params;

        await productModel.deleteProduct(productId, categoryId);

        res.status(201).json({success : true, message : "Product has been deleted!"});
    }catch(e){
        console.error("Error while deleting product : ", e);
        res.status(500).json({ success : false, message : `${e}`});
    }
};

// * Controller to update product pic and/or name based on product_id and category_id
async function updateProduct(req,res){
    try{
        const { productId, categoryId, productPic, productName } = req.body;

        await productModel.updateProduct(productId, categoryId, productPic, productName);

        res.status(201).json({ success : true, message : "Product has been updated!"});
    }catch(e){
        console.error("Error while updating product : ", e);
        res.status(500).json({ success : false, message : `${e}`});
    }
};

module.exports = {
    getAllProduct,
    addProduct,
    deleteProduct,
    updateProduct
};