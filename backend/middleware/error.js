const ErrorHander = require("../utils/ErrorHandler")

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    // cast error , wrong mongodb id error

    if (err.name === "CastError") { 
        const message = `Resourse not found. Invalid: ${err.path}`;
        err = new ErrorHander(message, 400);
    }


    // Mongoose duplicate key error
    if (err.code == 11000) { 
        const message = `Duplicate ${object.keys(err.keyValue)} Entered`;
        err = new ErrorHander(message, 400);
    }
    //  wrong jwt token
if (err.code == "JsonWebTokenError") { 
        const message = `Json Web Token is invalid, try again`;
        err = new ErrorHander(message, 400);
    }

    // JWT expire error
    if (err.code == "TokenExpireError") { 
        const message = `Json Web Token is Expired, try again`;
        err = new ErrorHander(message, 400);
    }


    res.status(err.statusCode).json({
        success: false, 
        message: err.message
    })
 
}