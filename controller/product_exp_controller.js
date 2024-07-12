const productExpModel = require('../model/product_exp_model');
const moment = require('moment');
require('moment/locale/id');

// * Controller to get all product exp based on product_detail_id
async function getAllProductExp(req,res){
    try{
        const { productDetailId } = req.params;

        const product_exp = await productExpModel.getAllProductExp(productDetailId);

        if(product_exp.length == 0){
            res.json({
                success : false,
                message : "No Product Expired"
            });
        }else{
            res.json({
                success : true,
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
        console.error('Error while fetching product expired : ', e);
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to add new product exp
async function addProductExp(req,res){
    try{
        const { productDetailId, expDate, quantity, productBarcode } = req.body;

        await productExpModel.addProductExp(productDetailId, expDate, quantity, productBarcode);

        res.status(201).json({ success : true, message : "New product expired has been added!" });
    } catch(e){
        console.error("Error while adding product expired : ", e);
        res.status(500).json({ success : false, message : `${e}`});
    }
};

// * Controller to delete product expired based on product_exp_id
async function deleteProductExp(req,res){
    try{
        const { quantity, productExpId, transactionType, note } = req.body;

        await productExpModel.deleteProductExp(quantity, productExpId, transactionType, note);

        res.status(201).json({ success : true, message : "Product expired has been deleted!"});
    } catch(e){
        console.error("Error while deleting product expired : ", e);
        res.status(500).json({ success : false, messagge : `${e}`});
    }
};

// * Controller to update product expired based on product_exp_id
async function updateProductExp(req,res){
    try{
        const { quantity, productExpId, transactionType, note } = req.body;

        await productExpModel.updateProductExp(quantity, productExpId, transactionType, note);

        res.status(201).json({ success: true, message : "Stock has been added"});
    }catch(e){
        console.error("Error while updating stock in product expired : ", e);
        res.status(500).json({ success : false, message :`${e}`});
    }
};

module.exports = {
    getAllProductExp,
    addProductExp,
    deleteProductExp,
    updateProductExp
};

