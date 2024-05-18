const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

// * First endpoint (/)
app.get('/', (req, res) => {
    res.sendFile("view/index.html", {root: __dirname});
});

// * Define all route here
const categoryRoute = require('./routes/category');

app.use('/category', categoryRoute);

module.exports = app;