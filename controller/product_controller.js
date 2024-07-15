const productModel = require('../model/product_model');

// * Controller to get All product based on category id
async function getAllProduct(req, res){
    try{
        const { categoryId } = req.params;

        const products = await productModel.getAllProduct(categoryId);
        
        if( products.length == 0 ){
            res.json({
                success : false,
                message : "Tidak ada produk di kategori ini"
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil dapat data produk!",
                products : products
            });
        }
        
    } catch(e){
        res.status(500).json({ success: false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to add new product
async function addProduct(req, res){
    try{
        const { categoryId, productPic, productName } = req.body;

        await productModel.addProduct(categoryId, productPic, productName);

        res.status(201).json({ success : true, message : "Produk berhasil ditambahkan!"});
    } catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to delete product based on product id and category id
async function deleteProduct(req,res){
    try{
        const { productId, categoryId } = req.params;

        await productModel.deleteProduct(productId, categoryId);

        res.status(201).json({success : true, message : "Produk berhasil dihapus!"});
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to update product pic and/or name based on product_id and category_id
async function updateProduct(req,res){
    try{
        const { productId, categoryId, productPic, productName } = req.body;

        await productModel.updateProduct(productId, categoryId, productPic, productName);

        res.status(201).json({ success : true, message : "Data produk berhasil diubah!"});
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

module.exports = {
    getAllProduct,
    addProduct,
    deleteProduct,
    updateProduct
};