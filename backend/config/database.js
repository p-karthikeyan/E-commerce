const mongoose = require('mongoose')


const connectDB=()=>{
    mongoose.connect(process.env.DB_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(con=>{
        console.log(`connected with the mongodb , connection host : ${con}`);
    })
}

module.exports=connectDB;