const ErrorHander = require("../utils/ErrorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");


exports.isAuthenticated = catchAsyncError( async( req, res, next) => { 
    const { token } = req.cookies;
    if (!token) { 
        return next( new ErrorHander("Please Login to acces this resouce"), 401)
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();

})

exports.authorizeRoles = (...roles)=> { 
    return (req, res, next) => { 
        if (!roles.includes(req.user.role)) { // agar role user admin nhi h toh error return kr denge
            return next(new ErrorHander(`Role: ${req.user.role} is not allowed to access this resourse`, 403)
            );
        }
        next();
    }
}