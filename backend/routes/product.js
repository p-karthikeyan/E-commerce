const express = require('express');
const { getProduct, newProduct, Product, updateProduct, deleteProduct, createReview, getReviews, deleteReview } = require('../controllers/productController');
const {isAuthenticate, AuthorizeUser} = require('../middlewares/authenticate')

const router = express.Router();

router.route('/products').get(isAuthenticate,AuthorizeUser('admin','user'),getProduct)
router.route('/products/:id')
                            .get(isAuthenticate,AuthorizeUser('admin','user'),Product)
                            .put(isAuthenticate,AuthorizeUser('admin'),updateProduct)
                            .delete(isAuthenticate,AuthorizeUser('admin'),deleteProduct)
                            
router.route('/product/new').post(isAuthenticate,AuthorizeUser('admin'),newProduct)

router.route('/review')
                        .put(isAuthenticate,createReview)
                        .delete(isAuthenticate,deleteReview)
router.route('/reviews').get(isAuthenticate,getReviews)

module.exports=router;

