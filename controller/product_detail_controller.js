const productDetailModel = require('../model/product_detail_model');

// * Controller to get ALl product detail based on product_id
async function getAllProductDetail(req,res){
    try{
        const { productId } = req.params;

        // const product_name = await productDetailModel.getAllProductDetail(productId).product_name;
        const productDetails = await productDetailModel.getAllProductDetail(productId);

        if(productDetails.length == 0){
            res.json({
                success : true,
                message : "No product variant"
            })
        }else{
            res.json({
                success : true,
                product_id : productDetails[0].product_id,
                product_pic : productDetails[0].product_pic,
                product_name : productDetails[0].product_name,
                productDetails : productDetails.map(
                    ({product_detail_id, product_detail_pic, product_detail_name, price})=>
                        ({product_detail_id, product_detail_pic, product_detail_name, price}
                    ))     
            })
        }
    } catch(e){
        console.error('Error while fetching product detail data : ', e);
        res.status(500).json({ success : false, message : "Internal server Error", e});
    }
};

// * Controller to add new product detail
async function addProductDetail(req,res){
    try{
        const { productId, productDetailPic, productDetailName, price } = req.body;

        await productDetailModel.addProductDetail(productId, productDetailPic, productDetailName, price);

        res.status(201).json({ success : true, message : "New Product variant has been added!"});
    } catch(e){
        console.error("Error while adding new product variant : ", e);
        res.status(500).json({ success : false, message : `${e}`});
    }
};

// * Controller to delete product detail based on product_id and product_detail_id
async function deleteProductDetail(req,res){
    try{
        const {productId, productDetailId } =req.params;

        await productDetailModel.deleteProductDetail(productId, productDetailId);

        res.status(201).json({success : true, message : "Product variant has been deleted!"});
    } catch(e){
        console.error("Error while deleting product detail : ", e);
        res.status(500).json({success : false, message : `${e}`});
    }
};

// * Controller to update product detail based on product_id and product_detail_id
async function updateProductDetail(req,res){
    try{
        const { productId, productDetailId, productDetailPic, productDetailName, price } = req.body;

        await productDetailModel.updateProductDetail(productId, productDetailId, productDetailPic, productDetailName, price);

        res.status(201).json({success : true, message : "Product variant has been updated!"});
    } catch(e){
        console.error("Error while updating product detail : ", e);
        res.status(500).json( {success : false, message : `${e}`, e});
    }
};

module.exports = {
    getAllProductDetail,
    addProductDetail,
    deleteProductDetail,
    updateProductDetail
};