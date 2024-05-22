const pool = require('../db/index');

// * Read all product
async function getAllProduct(categoryId){
    const query = `
        SELECT p.product_id, c.category_name, p.product_pic, p.product_name
        FROM products p JOIN category c ON p.category_id = c.category_id
        WHERE p.category_id = $1`;

        const values = [categoryId];
    
        const result = await pool.query(query, values);

        return result.rows;
};

// * Add new product to database
async function addProduct(categoryId, productPic, productName){
    const query = ` 
        INSERT INTO products(category_id, product_pic, product_name)
        VALUES  ($1, $2 , $3)`;
    
    const values = [ categoryId, productPic, productName];

    await pool.query(query, values);
};

// * Delete product based on product id and category id
async function deleteProduct(productId, categoryId){
    const query = `DELETE FROM products WHERE product_id = $1 and category_id = $2`;

    const values = [ productId, categoryId];

    await pool.query(query, values);
};

// * Update product pic and/ or name based on product id and category id
async function updateProduct(productId, categoryId, productPic, productName){
    let query = `UPDATE products SET`;

    const values = [];
    let valueIndex = 1;
    // let valueIndex2 = 2;
    let fieldsToUpdate = 0;

    if(productPic !== undefined){
        query += ` product_pic = $${valueIndex}`;
        values.push(productPic);
        valueIndex++;
        // valueIndex2++;
        fieldsToUpdate++;
    }

    if(productName !== undefined){
        if(fieldsToUpdate > 0){
            query += `,`;
        }

        query += ` product_name = $${valueIndex}`;
        values.push(productName);
        valueIndex++;
        // valueIndex2++;
        fieldsToUpdate++;
    }

    if(fieldsToUpdate > 0){
        query += ` WHERE product_id = $${valueIndex}`;
        values.push(productId);
        valueIndex++;

        query += ` AND category_id = $${valueIndex}`;
        values.push(categoryId);

        await pool.query(query, values);
    }else{
        throw new Error('No fileds to update');
    }
};


module.exports ={
    getAllProduct,
    addProduct,
    deleteProduct,
    updateProduct
};