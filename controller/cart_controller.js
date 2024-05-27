const cartModel = require('../model/cart_model');

// * Controller to fetch all cart
async function getAllCart(req,res){
    try{
        const { userId } = req.params;

        const carts = await cartModel.getAllCart(userId);
        
        if(carts.length == 0){
            res.json({
                success : true,
                message : "No Product List in this cart"
            });
        } else {
            res.json({
                success : true,
                user_id : carts[0].user_id,
                carts : carts.map(
                    ({cart_id, product_exp_id, product_name, product_detail_pic, product_detail_name, price}) =>
                        ({cart_id, product_exp_id, product_name, product_detail_pic, product_detail_name, price})
                )
            });
        }
    }catch(e){
        console.error('Error while fetching cart data : ', e);
        res.status(500).json({ success : false, message : `Interval Server Error : ${e}`});
    }
};

// * Controller to add new cart
async function addCart(req,res){
    try{
        const { userId, productBarcode } = req.body;

        await cartModel.addCart(userId, productBarcode);

        res.status(201).json({ success : true, message : "New cart has been added!"});
    }catch(e){
        console.error("Error while adding new cart : ", e);
        res.status(500).json({ success : false, message : `${e}`});
    }
};

module.exports = {
    getAllCart,
    addCart
};