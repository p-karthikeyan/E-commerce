const app = require('./app')
const dotenv = require('dotenv')
const path = require('path')
const connectDB = require('./config/database')

dotenv.config({path:path.join(__dirname,'config/config.env')})
const Port = process.env.PORT

connectDB();

const server = app.listen(Port,()=>{
    console.log(`Server is listening on port ${Port}`)
})

process.on("unhandledRejection",(err)=>{
    console.log(`error: ${err.message}`);
    console.log('server is going to shutdown , due to an unhandled rejection!')
    server.close(()=>{
        process.exit(1);
    })
})

process.on("uncaughtException",(err)=>{
    console.log(`error: ${err.message}`);
    console.log('server is going to shutdown , due to an uncaught Exception!')
    server.close(()=>{
        process.exit(1);
    })
})
