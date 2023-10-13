const sendToken = (user,statusCode,res)=>{
    const token = user.generateToken()
    res.status(statusCode).json({
        success:true,
        user,
        token
    })
}

module.exports = sendToken;