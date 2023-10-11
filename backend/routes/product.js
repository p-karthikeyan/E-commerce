const express = require('express');
const { getProduct, newProduct, Product, updateProduct, deleteProduct } = require('../controllers/productController');

const router = express.Router();

router.route('/products').get(getProduct)
router.route('/products/:id')
                            .get(Product)
                            .put(updateProduct)
                            .delete(deleteProduct)
                            
router.route('/product/new').post(newProduct)

module.exports=router

