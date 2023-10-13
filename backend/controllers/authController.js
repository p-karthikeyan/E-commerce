const handleAsyncError = require('../middlewares/handleAsyncError')
const User = require('../models/userModel');
const ErrorHandler = require('../utils/error');
const sendToken = require('../utils/jwt')

exports.registerUser=handleAsyncError(async(req,res,next)=>{
    const {name,email,password,avatar} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar
    })

    sendToken(user,201,res)
});

exports.loginUser=handleAsyncError(async(req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return next(new ErrorHandler("Enter the email & password!!",400))
    }
    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorHandler("Invalid email or password",401))
    }
    
    if(!await user.validatePswd(password)){
        return next(new ErrorHandler("Invalid email or password",401))
    }
    sendToken(user,201,res)
})