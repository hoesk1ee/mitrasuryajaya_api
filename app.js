const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const path = require('path');

app.use(bodyParser.json());

// * View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// * First endpoint (/)
app.get('/', (req, res) => {
    res.render("index", {root: __dirname});
});

// * Define all route here
const categoryRoute = require('./routes/category');
const userRoute = require('./routes/user');

app.use('/category', categoryRoute);
app.use('/user', userRoute);

// * route customer
const customerRoute = require('./routes/customer');
app.use('/customer', customerRoute);

// * route product
const productRoute = require('./routes/product');
app.use('/product', productRoute);

// * route product_detail
const productDetailRoute = require('./routes/product_detail');
app.use('/product-detail', productDetailRoute);

// * route product_exp
const productExpRoute = require('./routes/product_exp');
app.use('/product-exp', productExpRoute);

// * route cart
const cartRoute = require('./routes/cart');
app.use('/cart', cartRoute);

// * route invoice
const invoiceRoute = require('./routes/invoice');
app.use('/invoice', invoiceRoute);

// * route payment
const paymentRoute = require('./routes/payment');
app.use('/payment', paymentRoute);

module.exports = app;