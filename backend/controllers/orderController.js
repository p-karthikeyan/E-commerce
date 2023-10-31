const order = require('../models/orderModel');
const ErrorHandler = require('../utils/error');
const handleAsyncError = require('../middlewares/handleAsyncError');

exports.createOrder = handleAsyncError(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body

    const Order = await order.create(
        {
            shippingInfo,
            orderItems,
            itemPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo,
            user:req.user.id,
            paidAt:Date.now()
        }
    );

    res.status(200).json({
        success:true,
        message:"order created!!",
        Order
    })
})

exports.getOrder = handleAsyncError(async(req,res,next)=>{
    const Order = await order.findById(req.params.id).populate('user','name email')
    if(!Order){
        return new ErrorHandler("Invalid Order Id!",404);
    }
    res.status(200).json({
        success:true,
        Order
    })
})