const Product = require('../models/productModel')
const products = require('../data/products.json')
const dotenv = require('dotenv')
const connectDB = require('../config/database')

dotenv.config({path:'backend/config/config.env'})
connectDB();

const setproducts=async()=>{
    await Product.deleteMany();
    await Product.insertMany(products)
    console.log("product added !")
    process.exit()
}

setproducts();