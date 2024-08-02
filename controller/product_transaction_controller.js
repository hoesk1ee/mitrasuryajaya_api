const productTransactionModel = require('../model/product_transaction_model');

// * Controller to fetch product transaction based on transaction_type = Tambah
async function getAddProductTransaction(req, res){
    try{
        const productList = await productTransactionModel.getAddProductTransaction();

        if(productList.length == 0){
            res.json({
                success : false,
                message : "Tidak ada mutasi produk"
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil menampilkan mutasi produk",
                transaction_type : productList[0].transaction_type
                ,
                transaction_list : productList.map(({product_exp_id, product_name, product_detail_name, product_barcode, exp_date, quantity, note}) => 
                ({product_exp_id, product_name, product_detail_name, product_barcode, exp_date, quantity, note}))
            });
        }
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to fetch product transaction based on transaction type = 'Kurang'
async function getReduceProductTransaction(req,res){
    try{
        const productList = await productTransactionModel.getReduceProductTransaction();

        if(productList.length == 0){
            res.json({
                success : false,
                message : "Tidak ada mutasi produk"
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil menampilkan mutasi produk",
                transaction_type : productList[0].transaction_type,
                transaction_list : productList.map(({product_exp_id, product_name, product_detail_name, product_barcode, exp_date, quantity, note}) => 
                    ({product_exp_id, product_name, product_detail_name, product_barcode, exp_date, quantity, note}))
            });
        }
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to fetch product transaction based on product_exp_id
async function getTransactionByProductExpId(req,res){
    try{
        const { productExpId } = req.params;

        const productList = await productTransactionModel.getTransactionByProductExpId(productExpId);

        if(productList.length == undefined){
            res.json({
                success : false,
                product_exp_id : productList[0].product_exp_id,
                product_name : productList[0].product_name,
                product_detail_name : productList[0].product_detail_name,
                product_barcode : productList[0].product_barcode,
                exp_date : productList[0].exp_date,
                message : "Tidak ada mutasi produk"
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil menampilkan mutasi produk",
                product_exp_id : productList[0].product_exp_id,
                product_name : productList[0].product_name,
                product_detail_name : productList[0].product_detail_name,
                product_barcode : productList[0].product_barcode,
                exp_date : productList[0].exp_date,
                transaction_list : productList.map(({product_transaction_id, transaction_date, transaction_type, quantity, note}) => 
                    ({product_transaction_id, transaction_date, transaction_type, quantity, note}))
            })
        }
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to fetch all list
async function getAllList(req,res){
    try{
        const list = await productTransactionModel.getAllList();

        if(list.length == 0){
            res.json({
                success : false,
                message : "Tidak ada daftar produk" 
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil menampilkan daftar produk",
                category_list : list.map(({category_name, product_list}) => 
                    ({category_name, product_list : list.map(({product_name, product_detail_list}) => 
                        ({product_name, product_detail_list : list.map(({product_detail_name, price, product_exp_list}) => 
                            ({product_detail_name, price, product_exp_list : list.map(({exp_date, quantity, product_barcode}) => ({exp_date, quantity, product_barcode}))
                            }))
                        })) 
                    }))
                // category_list : list.category_name

            });
        }
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

module.exports = {
    getAddProductTransaction,
    getReduceProductTransaction,
    getTransactionByProductExpId,
    getAllList
};
