const express = require('express');
const product = require('./routes/product');
const errorMiddleware = require('./middlewares/error');
const auth = require('./routes/auth')


const app = express();

app.use(express.json());

app.use('/api/v1/',product)
app.use('/api/v1/',auth)

app.use(errorMiddleware)

module.exports=app;