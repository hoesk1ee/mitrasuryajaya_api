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
                success : true,
                message : "No product expired"
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

module.exports = {
    getAllProductExp
};

