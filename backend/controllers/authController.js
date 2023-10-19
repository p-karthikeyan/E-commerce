const handleAsyncError = require('../middlewares/handleAsyncError')
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
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

exports.logoutUser=(req,res,next)=>{
    return res.status(200)
    .cookie('token','',{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    .json({
        success:true,
        message:"Logged Out!"
    })
}

exports.getResetPasswordLink = handleAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next(new ErrorHandler("User not found!!",401));
    }
    const resetToken = user.getResetToken();
    await user.save({validateBeforeSave:false});

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/reset/password/${resetToken}`;
    const message = `Your password reset link is here, \n\n ${resetUrl} \n\n If it is not you, then just ignore this!`;

    try{
        // sending the mail
        sendEmail({
            email:user.email,
            subject:`Reset Password,${user.name}!`,
            message
        })
        res.status(200).json({
            success:true,
            message:"Reset Password Mail sent!"
        })
    }
    catch(err){
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorHandler(err.message,500));
    }
});