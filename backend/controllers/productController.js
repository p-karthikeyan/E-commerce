const product = require('../models/productModel');
const ErrorHandler = require('../utils/error');
const handleAsyncError = require('../middlewares/handleAsyncError')
const APIfeatures = require('../utils/apiFeatures')

// roue api/v1/products     GET
exports.getProduct=async (req,res,next)=>{
    const productPerPage = 2;
    const apiFeatures = new APIfeatures(product.find(),req.query).search().filter().paginate(productPerPage);

    let Products = await apiFeatures.query;
    res.status(200).json({
        success:true,
        message:"Products received..",
        Products
    });
}

// route api/v1/product/new      POST
exports.newProduct=handleAsyncError(async (req,res,next)=>{
    req.body.user = req.user.id
    let Product = await product.create(req.body);
    res.status(200).json({
        success:true,
        message:"Product Added !",
        Product
    });
});

// route api/v1/products/:id      GET
exports.Product=async (req,res,next)=>{
    let Product = await product.findById(req.params.id)

    if(!Product){
        return next(new ErrorHandler("Product not found!",400));
    }
    res.status(200).json({
        success:true,
        message:"Your product is here..",
        Product
    });

}; 

// route api/v1/products/:id      PUT
exports.updateProduct=async(req,res,next)=>{
    let Product = await product.findById(req.params.id)

    if(!Product){
        res.status(404).json({
            success:false,
            message:"product not found!"
        })
    }
    Product = await product.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })

    res.status(200).json({
        success:true,
        message:"Your product is updated!!",
        Product
    });

}

// route api/v1/products/:id      DELETE
exports.deleteProduct=async (req,res,next)=>{
    let Product = await product.findById(req.params.id)

    if(!Product){
        res.status(404).json({
            success:false,
            message:"product not found!"
        })
    }

    await product.findByIdAndDelete(req.params.id)
    res.status(200).json({
        success:true,
        message:"Your product has beed deleted!"
    });

}

exports.createReview = handleAsyncError(async(req,res,next)=>{
    const {productId,rating,comment} = req.body;
    let review = {
        user:req.user.id,
        rating,
        comment
    } 
    const Product = await product.findById(productId)
    const isReviewed = Product.reviews.find(review=>{
        return (review.user.toString()==req.user.id.toString())
    })
    if(isReviewed){
        Product.reviews.forEach(review=>{
            if(review.user.toString()==req.user.id.toString()){
                review.rating = rating,
                review.comment = comment
            }
        })
    }else{
        Product.reviews.push(review);
        Product.numOfReviews = Product.reviews.length;
    }
    let ratings = Product.reviews.reduce((acc,review)=>{
        return acc+review.rating
    },0)/Product.reviews.length
    ratings = isNaN(ratings)?0:ratings;
    Product.ratings = ratings;
    await Product.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
        message:"Review Added!.."
    })
})

exports.getReviews = handleAsyncError(async(req,res,next)=>{
    const Product = await product.findById(req.query.id)
    if(!Product){return new ErrorHandler("Invali Product!")}
    res.status(200).json({
        success:true,
        reviews:Product.reviews
    })
})

exports.deleteReview = handleAsyncError(async(req,res,next)=>{
    const Product = await product.findById(req.query.productId)
    if(!Product){return new ErrorHandler("Invalid Product!..")}
    const reviews = Product.reviews.filter(review=>{
        return(review._id.toString()!=req.query.id)
    })
    let ratings = reviews.reduce((acc,review)=>{
        return acc+review.rating
    },0)/reviews.length
    ratings = isNaN(ratings)?0:ratings

    await product.findByIdAndUpdate(req.query.productId,{
        reviews,
        numOfReviews:reviews.length,
        ratings
    })
    res.status(200).json({
        success:true,
        message:"review removed successfully.."
    })
})
