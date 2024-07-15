const customerModel = require('../model/customer_model');

// * Controller to get All Customer
async function getAllCustomers(req,res){
    try{
        const customers = await customerModel.getAllCustomers();

        if(customers.length == 0){
            res.json({
                success : false,
                message : "Tidak ada data customer di apilkasi ini"
            });
        }else{
            res.json(
                {
                    success : true,
                    message : "Berhasil dapat data customer!",
                    customers : customers
                }
            );
        }   
    }catch(e){
        res.status(500).json({succes : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to get Customer Based on Id
async function getCustomerById(req, res){
    try{
        const { customerId } = req.params;

        const customers = await customerModel.getCustomerById(customerId);

        if(customers.length == 0){
            res.json({
                success : false,
                message : "Tidak ada customer dengan ID ini"
            });
        }else{
            res.json({
                success : true,
                message : "Berhasil dapat data customer!",
                customers : customers
            });
        }
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to Add Customer
async function addCustomer(req,res){
    try{
        const { customerName, customerPhone, customerAddress } = req.body;

        await customerModel.addCustomer(customerName, customerPhone, customerAddress);

        res.status(201).json({ success : true, message : "Customer baru berhasil ditambahkan!"});
    } catch (e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

// * Controller to Delete Customer based on ID
async function deleteCustomer (req, res){
     try{
        const { customerId } = req.params;

        await customerModel.deleteCustomer(customerId);

        res.status(201).json({ success : true, message : "Customer berhasil dihapus!"});
     } catch (e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
     }
};

// * Controller to Update Customer Based on Id
async function updateCustomer(req,res){
    try{
        const { customerId, customerName, customerPhone, customerAddress} = req.body;
        
        await customerModel.updateCustomer(customerId, customerName, customerPhone, customerAddress);

        res.status(201).json({ success : true, message : "Data customer berhasil diubah!"});
    }catch(e){
        res.status(500).json({ success : false, message : `Internal Server Error : ${e}`});
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    addCustomer,
    deleteCustomer,
    updateCustomer
};