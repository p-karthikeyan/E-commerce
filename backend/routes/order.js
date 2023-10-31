const express = require('express');
const router = express.Router();
const {isAuthenticate, AuthorizeUser} = require('../middlewares/authenticate')
const {createOrder, getOrder} = require('../controllers/orderController')

router.route('/new/order').post(isAuthenticate,AuthorizeUser('admin'),createOrder)
router.route('/order/:id').get(isAuthenticate,AuthorizeUser('admin'),getOrder)

module.exports = router;