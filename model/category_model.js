const pool = require('../db/index');

// * Read all categories
async function getAllCategories(){
    const query = 'SELECT * FROM category';
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
    const query = `DELETE FROM category WHERE category_id = $1`;

    const values = [categoryId];

    await pool.query(query, values);
};

module.exports = {
    getAllCategories,
    addCategory,
    deleteCategory,
};