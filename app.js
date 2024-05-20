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

app.use('/category', categoryRoute);

// * route customer
const customerRoute = require('./routes/customer');
app.use('/customer', customerRoute);

module.exports = app;