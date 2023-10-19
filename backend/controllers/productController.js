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
