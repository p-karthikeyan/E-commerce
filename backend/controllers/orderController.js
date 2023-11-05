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

exports.myOrders = handleAsyncError(async(req,res,next)=>{
    const Orders = await order.find({user:req.user.id})
    if(!Orders){
        return new ErrorHandler(`No orders found the user ${req.user.name}`,404)
    }
    res.status(200).json({
        success:true,
        message:"Your Orders are..",
        Orders
    })
})

exports.allOrders = handleAsyncError(async(req,res,next)=>{
    const Orders = await order.find();
    if(!Orders){
        return new ErrorHandler(`No orders found!`,404)
    }
    res.status(200).json({
        success:true,
        message:"All Orders..",
        Orders
    })
})

exports.updateOrder = handleAsyncError(async(req,res,next)=>{
    const Order = await order.findById(req.params.id)
    if(Order.orderStatus == "Delivered"){
        return new ErrorHandler("The product is already delivered!",404)
    }
    Order.orderStatus = "Delivered"
    Order.deliveredAt = Date.now();
    Order.save({
        validateBeforeSave:false
    })
    res.status(200).json({
        success:true,
        message:"Order Delivered!"
    })
})

exports.deleteOrder = handleAsyncError(async(req,res,next)=>{
    const Order = await order.findById(req.params.id)
    if(!Order){
        return new ErrorHandler(`No orders found!`,404)
    }
    await Order.deleteOne()
    res.status(200).json({
        success:true,
        message:"Order removed successfully!"
    })
})