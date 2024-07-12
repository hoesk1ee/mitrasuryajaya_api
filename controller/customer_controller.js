const customerModel = require('../model/customer_model');

// * Controller to get All Customer
async function getAllCustomers(req,res){
    try{
        const customers = await customerModel.getAllCustomers();

        if(customers.length == 0){
            res.json({
                success : false,
                message : "No Customer in this application"
            });
        }else{
            res.json(
                {
                    success : true,
                    customers : customers
                }
            );
        }   
    }catch(e){
        console.error('Error fetching customers data : ', e);
        res.status(500).json({succes : false, error : "Internal server Error : ", e});
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
                message : "No Customer with this ID"
            });
        }else{
            res.json({
                success : true,
                customers : customers
            });
        }
    }catch(e){
        console.error('Error fetching customers data : ', e);
        res.status(500).json({ success : false, error : 'Internal server error : ', e});
    }
};

// * Controller to Add Customer
async function addCustomer(req,res){
    try{
        const { customerName, customerPhone, customerAddress } = req.body;

        await customerModel.addCustomer(customerName, customerPhone, customerAddress);

        res.status(201).json({ success : true, message : "New Customer has been added!"});
    } catch (e){
        console.error("Error while adding new customer : ", e);
        res.status(500).json({ success : false, message : `${e}`});
    }
};

// * Controller to Delete Customer based on ID
async function deleteCustomer (req, res){
     try{
        const { customerId } = req.params;

        await customerModel.deleteCustomer(customerId);

        res.status(201).json({ success : true, message : "Customer has been deleted!"});
     } catch (e){
        console.error("Error while deleting customer : ", e);
        res.status(500).json({ success : false, message : `${e}`});
     }
};

// * Controller to Update Customer Based on Id
async function updateCustomer(req,res){
    try{
        const { customerId, customerName, customerPhone, customerAddress} = req.body;
        
        await customerModel.updateCustomer(customerId, customerName, customerPhone, customerAddress);

        res.status(201).json({ success : true, message : "Customer has been updated!"});
    }catch(e){
        console.error("Error while updating customer : ", e);
        res.status(500).json({ success : false, message : `${e}`});
    }
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    addCustomer,
    deleteCustomer,
    updateCustomer
};