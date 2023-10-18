const express = require('express');
const { getProduct, newProduct, Product, updateProduct, deleteProduct } = require('../controllers/productController');
const {isAuthenticate, AuthorizeUser} = require('../middlewares/authenticate')

const router = express.Router();

router.route('/products').get(isAuthenticate,AuthorizeUser('admin','user'),getProduct)
router.route('/products/:id')
                            .get(isAuthenticate,AuthorizeUser('admin','user'),Product)
                            .put(isAuthenticate,AuthorizeUser('admin'),updateProduct)
                            .delete(isAuthenticate,AuthorizeUser('admin'),deleteProduct)
                            
router.route('/product/new').post(isAuthenticate,AuthorizeUser('admin'),newProduct)

module.exports=router

