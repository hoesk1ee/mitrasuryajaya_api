const cartModel = require('../model/cart_model');
const moment = require('moment');
require('moment/locale/id');

// * Controller to fetch all cart
async function getAllCart(req,res){
    try{
        const { userId } = req.params;

        const carts = await cartModel.getAllCart(userId);
        
        if(carts.length == 0){
            res.json({
                success : false,
                message : "Tidak ada list produk di keranjang ini"
            });
        } else {
            res.json({
                success : true,
                message : "Berhasil dapat data cart!",
                user_id : carts[0].user_id,
                carts : carts.map(
                    ({cart_id, product_exp_id, product_name, product_detail_pic, product_detail_name, price, quantity, exp_date}) =>
                        ({cart_id, product_exp_id, product_name, product_detail_pic, product_detail_name, price, quantity, exp_date : moment(exp_date).locale('id').format('DD MMMM YYYY')})
                )
            });
        }
    }catch(e){
        res.status(500).json({ success : false, message : `Interval Server Error : ${e}`});
    }
};

// * Controller to add new cart
async function addCart(req,res){
    try{
        const { userId, productBarcode } = req.body;

        const carts = await cartModel.addCart(userId, productBarcode);

        console.log(carts);

        if(carts === false){
            res.json({
                success : false,
                message : "Product Barcode tidak ditemukan!"
            });
        }else{
            res.status(201).json({ 
                success : true, 
                message : "Cart baru berhasil ditambahkan!",
                item_descriptions : carts
            });
        }

    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to delete cart based on userId and productExpId
async function deleteCart(req,res){
    try{
        const { userId, productExpId } = req.params;

        await cartModel.deleteCart(userId, productExpId);

        res.status(201).json({ success : true, message : "Cart berhasil dihapus!"});
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}` });
    }
};

// * Controller to update cart based on cart_id and user_id
async function updateCart(req,res){
    try{
        const { quantity, cartId, userId } = req.body;

        await cartModel.updateCart(quantity, cartId, userId);

        res.status(201).json({ success : true, message : "Jumlah kuantitas berhasil diubah!"});
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

module.exports = {
    getAllCart,
    addCart,
    deleteCart, 
    updateCart
};