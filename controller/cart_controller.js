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
                    ({cart_id, product_exp_id, product_name, product_detail_pic, product_detail_name, price, quantity}) =>
                        ({cart_id, product_exp_id, product_name, product_detail_pic, product_detail_name, price, quantity})
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

// * Controller to delete cart based on userId and productExpId
async function deleteCart(req,res){
    try{
        const { userId, productExpId } = req.params;

        await cartModel.deleteCart(userId, productExpId);

        res.status(201).json({ success : true, message : "Cart has been deleted!"});
    }catch(e){
        console.error("Error while deleting cart : ", e);
        res.status(500).json({ success : false, message : `${e}` });
    }
};

// * Controller to update cart based on cart_id and user_id
async function updateCart(req,res){
    try{
        const { quantity, cartId, userId } = req.body;

        await cartModel.updateCart(quantity, cartId, userId);

        res.status(201).json({ success : true, message : "Quantity has been updated!"});
    }catch(e){
        console.error("Error while updating cart : ", e);
        res.status(500).json({ success : false, message : `${e}`});
    }
};

module.exports = {
    getAllCart,
    addCart,
    deleteCart, 
    updateCart
};