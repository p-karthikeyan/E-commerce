const express = require('express');
const { getProduct, newProduct, Product, updateProduct, deleteProduct } = require('../controllers/productController');
const {isAuthenticate} = require('../middlewares/authenticate')

const router = express.Router();

router.route('/products').get(isAuthenticate,getProduct)
router.route('/products/:id')
                            .get(Product)
                            .put(updateProduct)
                            .delete(deleteProduct)
                            
router.route('/product/new').post(newProduct)

module.exports=router

