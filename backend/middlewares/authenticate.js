const asyncErrorHandler = require('../middlewares/handleAsyncError')
const ErrorHandler = require('../utils/error')
const jwt = require('jsonwebtoken');
const User = require('../models/userModel')

exports.isAuthenticate=asyncErrorHandler(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login to access this resource!",401))
    }
    const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodedToken.id);
    
    next(); 
});

exports.AuthorizeUser = (...roles)=>{
    return (req,res,next)=>{

        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} role can't do this action!`));
        }
        next();
    }
}