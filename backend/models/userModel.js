const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter the name!"]
    },
    email:{
        type:String,
        required:[true,"Please enter the email field!"],
        unique:true,
        validate:[validator.isEmail,"Enter a valid Email!!"]
    },
    password:{
        type:String,
        required:[true,"Enter the password!"],
        maxlength:[10,"password length cannot exceed 10"],
        select:false
    },
    avatar:{
        type:String,
        required:[true,"Upload a profile pic!"]
    },
    role:{
        type:String,
        default:'user'
    },
    passwordResetToken:String,
    passwordResetTokenExpire:String,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    this.password = await bcrypt.hash(this.password,10);
})

userSchema.methods.generateToken=function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRY_TIME
    })
}

userSchema.methods.validatePswd=async function(userPswd){
    return await bcrypt.compare(userPswd,this.password);
}

userSchema.methods.getResetToken = function(){
    const Token = crypto.randomBytes(20).toString('hex');
    const resetToken = crypto.createHash('sha256').update(Token).digest('hex');
    this.passwordResetToken = resetToken;
    this.passwordResetTokenExpire = Date.now()+10*60*1000;
    return Token;
}

const model = mongoose.model('user',userSchema);

module.exports = model;