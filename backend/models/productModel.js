const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide the name of product"],
        trim:true,
        maxlength:100
    },
    price:{
        type:Number,
        default:0.00
    },
    description:{
        type:String,
        required:[true,"Please provide the description for the product"]
    },
    ratings:{
        type:String,
        default:0
    },
    images:[
        {
            image:{
                type:String,
                required:true
            }
        }
    ],
    category:{
        type:String,
        required:true,
        enum:{
            values:[
                "Fashions",
                "Food",
                "Electronics",
                "Books",
                "MobilePhones",
                "Laptops",
                "Cosmetics",
                "Home",
            ],
            message:"Please select a valid category!"
        }
    },
    seller:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true,
        maxLength:20
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            ratings:{
                type:String,
                default:0
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const schema = mongoose.model('product',productSchema)

module.exports = schema;