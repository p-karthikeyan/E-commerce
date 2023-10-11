const express = require('express');
const product = require('./routes/product');
const errorMiddleware = require('./middlewares/error');


const app = express();

app.use(express.json());

app.use('/api/v1/',product)

app.use(errorMiddleware)

module.exports=app;