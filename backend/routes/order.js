const express = require('express');
const router = express.Router();
const {isAuthenticate, AuthorizeUser} = require('../middlewares/authenticate')
const {createOrder, getOrder, updateOrder, myOrders, allOrders, deleteOrder} = require('../controllers/orderController')

router.route('/new/order').post(isAuthenticate,AuthorizeUser('admin'),createOrder)
router.route('/myorders').get(isAuthenticate,myOrders)
router.route('/orders').get(isAuthenticate,AuthorizeUser('admin'),allOrders)
router.route('/order/:id')
                        .get(isAuthenticate,AuthorizeUser('admin'),getOrder)
                        .put(isAuthenticate,AuthorizeUser('admin'),updateOrder)
                        .delete(isAuthenticate,AuthorizeUser('admin'),deleteOrder)

module.exports = router;