const productExpModel = require('../model/product_exp_model');
const moment = require('moment');
require('moment/locale/id');

// * Controller to get all product exp based on product_detail_id
async function getAllProductExp(req,res){
    try{
        const { productDetailId } = req.params;

        const product_exp = await productExpModel.getAllProductExp(productDetailId);

        if(product_exp.length == undefined){
            res.json({
                success : true,
                product_id : product_exp.product_id,
                product_name : product_exp.product_name,
                product_detail_pic : product_exp.product_detail_pic,
                product_detail_name : product_exp.product_detail_name,
                price : product_exp.price,
                message : "Tidak ada produk kadaluwarsa!"
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil dapat data produk kadaluwarsa!",
                product_id : product_exp[0].product_id,
                product_name : product_exp[0].product_name,
                product_detail_pic : product_exp[0].product_detail_pic,
                product_detail_name : product_exp[0].product_detail_name,
                price : product_exp[0].price,
                product_data : product_exp.map(({exp_date, quantity, product_barcode}) => ({
                    exp_date : moment(exp_date).locale('id').format('DD MMMM YYYY'), 
                    quantity, 
                    product_barcode
                }))
            });
        }
    } catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to add new product exp
async function addProductExp(req,res){
    try{
        const { productDetailId, expDate, quantity, productBarcode } = req.body;

        await productExpModel.addProductExp(productDetailId, expDate, quantity, productBarcode);

        res.status(201).json({ success : true, message : "Produk kadaluwarsa berhasil ditambahkan!" });
    } catch(e){
        res.status(500).json({ success : false, message : `${e}`});
    }
};

// * Controller to delete product expired based on product_exp_id
async function deleteProductExp(req,res){
    try{
        const { quantity, productExpId, transactionType, note } = req.body;

        await productExpModel.deleteProductExp(quantity, productExpId, transactionType, note);

        res.status(201).json({ success : true, message : "Produk kadaluwarsa berhasil dihapus!"});
    } catch(e){
        res.status(500).json({ success : false, messagge : `Internal Server Error : ${e}`});
    }
};

// * Controller to update product expired based on product_exp_id
async function updateProductExp(req,res){
    try{
        const { quantity, productExpId, transactionType, note } = req.body;

        await productExpModel.updateProductExp(quantity, productExpId, transactionType, note);

        res.status(201).json({ success: true, message : "Stok berhasil ditambahkan"});
    }catch(e){
        res.status(500).json({ success : false, message :`Internal Server Error : ${e}`});
    }
};

module.exports = {
    getAllProductExp,
    addProductExp,
    deleteProductExp,
    updateProductExp
};

