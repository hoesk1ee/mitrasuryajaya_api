const productDetailModel = require('../model/product_detail_model');

// * Controller to get ALl product detail based on product_id
async function getAllProductDetail(req,res){
    try{
        const { productId } = req.params;

        const productDetails = await productDetailModel.getAllProductDetail(productId);

        if(productDetails.length == undefined){
            res.json({
                success : true,
                product_id : productDetails.product_id,
                product_name : productDetails.product_name,
                product_pic : productDetails.product_pic,
                message : "Tidak ada varian produk!"
            })
        }else{
            res.json({
                success : true,
                message : "Berhasil dapat data varian produk!",
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
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to add new product detail
async function addProductDetail(req,res){
    try{
        const { productId, productDetailPic, productDetailName, price } = req.body;

        await productDetailModel.addProductDetail(productId, productDetailPic, productDetailName, price);

        res.status(201).json({ success : true, message : "Varian produk baru berhasil ditambahkan!"});
    } catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to delete product detail based on product_id and product_detail_id
async function deleteProductDetail(req,res){
    try{
        const {productId, productDetailId } =req.params;

        await productDetailModel.deleteProductDetail(productId, productDetailId);

        res.status(201).json({success : true, message : "Varian produk berhasil dihapus!"});
    } catch(e){
        res.status(500).json({success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to update product detail based on product_id and product_detail_id
async function updateProductDetail(req,res){
    try{
        const { productId, productDetailId, productDetailPic, productDetailName, price } = req.body;

        await productDetailModel.updateProductDetail(productId, productDetailId, productDetailPic, productDetailName, price);

        res.status(201).json({success : true, message : "Data varian produk berhasil diubah!"});
    } catch(e){
        res.status(500).json( {success : false, message : `Internal Server Error : ${e}`, e});
    }
};

module.exports = {
    getAllProductDetail,
    addProductDetail,
    deleteProductDetail,
    updateProductDetail
};