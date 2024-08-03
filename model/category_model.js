const pool = require('../db/index');

// * Read all categories
async function getAllCategories(){
    const query = `SELECT * FROM category WHERE is_deleted = false`;
    const result = await pool.query(query);

    return result.rows;
};

// * Add new category to database
async function addCategory(categoryPic, categoryName){
    const query = `
        INSERT INTO category(category_pic, category_name)
        VALUES 
        ($1, $2)
    `;

    const values = [categoryPic, categoryName];

    await pool.query(query, values);
};

// * Delete category based on ID
async function deleteCategory(categoryId){
    const query = `UPDATE category SET is_deleted = true WHERE category_id = $1`;

    const values = [categoryId];

    const result = await pool.query(query, values);
    console.log(result.rowCount);
};

// * Update category based on ID 
async function updateCategory(categoryId, categoryPic, categoryName){
    let query = `UPDATE category SET`;

    const values = [];
    let valueIndex = 1;
    let fieldsToUpdate = 0;

    if (categoryPic !== undefined){
        query += ` category_pic = $${valueIndex}`;
        values.push(categoryPic);
        valueIndex++;
        fieldsToUpdate++;
    }

    if (categoryName !== undefined){
        if (fieldsToUpdate > 0){
            query += ',';
        }

        query += ` category_name = $${valueIndex}`;
        values.push(categoryName);
        valueIndex++;
        fieldsToUpdate++;
    }
    
    if (fieldsToUpdate > 0){
        query += ` WHERE category_id = $${valueIndex}`;
        values.push(categoryId);

        await pool.query(query, values);
    } else {
        throw new Error('No fields to update');
    }
};

module.exports = {
    getAllCategories,
    addCategory,
    deleteCategory,
    updateCategory,
};