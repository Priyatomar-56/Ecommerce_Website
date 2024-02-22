
const Product = require("../models/ProductModels");
const ErrorHander = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const Apifeatures = require("../utils/Apifeatures");

// Create product --Admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product Created", product });
});

// get products
exports.getProducts = catchAsyncError(async (req, res ,next) => {

    const ResultPerPage = 8;
    const Productcount = await Product.countDocuments();
    const apiFeature = new Apifeatures(Product.find(), req.query).search().filter().pagination(ResultPerPage);

  const Allproducts = await apiFeature.query;
  if (!Allproducts) { 
            return next(new ErrorHander("Error in getting product", 404));

  }
    res.status(200).json({ message: "got product", Allproducts, Productcount });
});

// get single product details

exports.getProductDetails = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("Product is not availabe", 404));
    }
    return res.status(200).json({ message: "product found", product })
});




// Update product -- Admin
 
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHander("Product is not availabe", 404));
    }
 
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({ message: "Product Updated succesfully", product })
});

// delete a product 
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
 
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new ErrorHander("Product is not availabe to delete", 404));    }
    await product.deleteOne();;

    res.status(200).json({ message: "Product deleted succesfully" });
});

// create new review and update the review

exports.CreateProductReview = catchAsyncError(async (req, res, next) => {
    
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating:Number(rating),
        comment,
    }

    const product = await Product.findById(productId);
     if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    const isReviewed = product.reviews.find(rev => rev.user.toString()===req.user._id.toString());
    if (isReviewed) {
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id.toString())
                rev.rating = rating,
                rev.comment=comment
        })
    }
    else {
        product.reviews.push(review);
        product.NumofReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach(rev => {
    avg = avg + rev.rating;
    })
    product.ratings = avg / product.reviews.length;

    // ratings is the overall rating of the product
    // rating is for one particular product by a user both r differnet go and check in model
    
    await product.save({ validateBeforeSave: false });
    res.status(200).json({ message: " Rating done successsfull" })

})


// get all reviews of product

exports.GetAllReviews = catchAsyncError(async (req, res, next) => { 
       const product = await Product.findById(req.query.id);
    if (!product) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({   success: true,
    reviews: product.reviews, });
})

// delete reviews
// Delete Review
exports.DeleteReviews= catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});