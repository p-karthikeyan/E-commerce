const app = require('./app')
const dotenv = require('dotenv')
const path = require('path')
const connectDB = require('./config/database')

dotenv.config({path:path.join(__dirname,'config/config.env')})
const Port = process.env.PORT

connectDB();

app.listen(Port,()=>{
    console.log(`Server is listening on port ${Port}`)
})