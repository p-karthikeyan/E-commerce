const handleAsyncError = require('../middlewares/handleAsyncError')
const User = require('../models/userModel');
const sendEmail = require('../utils/email');
const ErrorHandler = require('../utils/error');
const sendToken = require('../utils/jwt')
const crypto = require('crypto');

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

exports.resetPassword = handleAsyncError(async (req,res,next)=>{
    const ResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    
    const user = await User.findOne({
        passwordResetToken:ResetToken,
        passwordResetTokenExpire:{
            $gt : Date.now()
        }
    })

    if(!user){
        return next(new ErrorHandler("Invalid Reset Token or might expired!!",401));
    }

    if(req.body.password!==req.body.confirmPassword){
        return next(new ErrorHandler("Password not match!",401));
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save({validateBeforeSave:false});

    sendToken(user,201,res);

});

exports.getProfile = handleAsyncError(async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    if(!user){
        return next(new ErrorHandler("User not found!!",401));
    }
    res.status(200).json({
        success:true,
        user
    })
});

exports.updateProfile = handleAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    if(!user){
        return next(new ErrorHandler("User not found!!",401));
    }
    const newData = {
        name:req.body.name,
        email:req.body.email
    }
    await User.findByIdAndUpdate(req.user.id,newData,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        message:"profile updated!"
    })
});

exports.changePassword = handleAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');
    if(!user){
        return next(new ErrorHandler("User not found!!",401));
    }
    if(!await user.validatePswd(req.body.oldPassword)){
        return next(new ErrorHandler("old password is incorrect!"));
    }
    user.password = req.body.password;
    await user.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
        message:"password changed successfully!"
    })
});

exports.getUsers = handleAsyncError(async(req,res,next)=>{
    const users = await User.find();
    res.status(200).json({
        success:true,
        users
    })
});

exports.getUser = handleAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("User not found!!",401));
    }
    res.status(200).json({
        success:true,
        user
    })
});

exports.updateUser = handleAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("User not found!!",401));
    }
    const newData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    await User.findByIdAndUpdate(req.params.id,newData,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        message:"profile updated!"
    })
});

exports.deleteUser = handleAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandler("User not found!!",401));
    }
    await user.deleteOne();
    res.status(200).json({
        success:true,
        message:"User removed!"
    })
});