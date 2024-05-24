const pool = require('../db/index');

// * Read All product-detail
async function getAllProductDetail(productId){
    const query = `SELECT p.product_id, p.product_name, p.product_pic, pd.product_detail_id,
	    pd.product_detail_pic, pd.product_detail_name, pd.price
	    FROM product_detail pd 
	    JOIN products p ON pd.product_id = p.product_id
	    WHERE pd.product_id = $1
	`;

    const values = [ productId ];

    const result = await pool.query(query, values);

    return result.rows;
};

// * Add product detail
async function addProductDetail(productId, productDetailPic, productDetailName, price){
    const query = `
        INSERT INTO product_detail (product_id, product_detail_pic, product_detail_name, price)
        VALUES ($1,$2, $3, $4)`;

    const values = [productId, productDetailPic, productDetailName, price];

    await pool.query(query, values);
};

// * Delete product detail based on product_id and product_detail_id
async function deleteProductDetail(productId, productDetailId){
    const query = `
        DELETE FROM product_detail 
	    WHERE product_id = $1 AND product_detail_id = $2`;
    
        const values = [ productId, productDetailId];

        await pool.query(query, values);
}

// * Update product detail pic and/or name based on product_id and product_detail_id
async function updateProductDetail(productId, productDetailId, productDetailPic, productDetailName, price){
    let query = `UPDATE product_detail SET`;

    const values = [];
    let valueIndex = 1;
    let fieldsToUpdate = 0;

    if(productDetailPic !== undefined){
        query += ` product_detail_pic = $${valueIndex}`;
        values.push(productDetailPic);
        valueIndex++;
        fieldsToUpdate++;
    }

    if(productDetailName !== undefined){
        if(fieldsToUpdate > 0){
            query += `,`;
        }

        query += ` product_detail_name = $${valueIndex}`;
        values.push(productDetailName);
        valueIndex++;
        fieldsToUpdate++;
    }

    if(price !== undefined){
        if(fieldsToUpdate > 0){
            query += `,`;
        }

        query += ` price = $${valueIndex}`;
        values.push(price);
        valueIndex++;
        fieldsToUpdate++;
    }

    if(fieldsToUpdate > 0){
        query += ` WHERE product_id = $${valueIndex}`;
        values.push(productId);
        valueIndex++;

        query += ` AND product_detail_id = $${valueIndex}`;
        values.push(productDetailId);

        await pool.query(query, values);
    } else {
        throw new Error('No fields to Update');
    }
};

module.exports = {
    getAllProductDetail,
    addProductDetail,
    deleteProductDetail,
    updateProductDetail
};