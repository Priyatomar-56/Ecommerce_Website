const ErrorHander = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require('../utils/JwtToken')
const User = require("../models/UserModel");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

// Register a user
exports.registerUser = catchAsyncError(async (req, res, next) => { 
    const { name, email, password } = req.body; 
    const user = await User.create({
        name, email, password,
        avatar: {
            publicId: "This is sample id",
            url: "jshdkjsa"
        }
    });
    // const token = user.getJWTToken();
    // res.status(201).json({ message: "User registered succesfully", token,});
    sendToken(user, 201, res);
})


// loginuser
exports.loginUser = catchAsyncError(async (req, res, next) => { 
    const { email, password } = req.body;
    //  checking if the password and email is correct
    if (!email || !password) { 
        return next(new ErrorHander("Please Enter email & Password", 400))
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) { 
        return next(new ErrorHander("InValid email or password", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) { 
                return next(new ErrorHander("InValid email or password", 401));

    }
    // const token = user.getJWTToken();
    // res.status(200).json({ message: "User Login succesfully", token,});

    sendToken(user, 200, res);
})

// Logoutuser
exports.logoutUser = catchAsyncError(async (req, res, next) => { 
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({ message: "Logout successfully" });
})

// Forfot password
exports.ForgotPassword = catchAsyncError(async (req, res, next) => { 
    const user = await User.findOne({ email: req.body.email });
    if (!user) { 
        return next(new ErrorHander("User does not exist"), 401);
    }
    // get resetpassword token
    const resetToken = user.getResestPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetpassowrdUrl = `${req.protocol}://${req.get("host")}/api/create/password/reset/${resetToken}`;
    const message = `Your password reset token is:- \n\n ${resetpassowrdUrl} \n\n if you have not requested this email then ignore it.`;
    try { 
        await sendEmail({
            email: user.email,
            subject: `Ecommerce password Recovery`,
            message,
        });
        res.status(200).json({message:`Email sent to ${user.email} succesfully`, resetToken})
    } catch (err) { 
        console.log(`error`, err);
        user.resetpasswordToken = undefined;
        user.resetpasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        return next(new ErrorHander(err.message, 500));
    }
})

// reset password
exports.ResetPassword = catchAsyncError(async (req, res, next) => {
    // generate token
    const resetpasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetpasswordToken,
        resetpasswordExpire: { $gt: Date.now() },
    });

    if (!user) { 
        return next(new ErrorHander("Reset Password Token is invalid or has been expired", 400));
    }

    if (req.body.password !== req.body.confirmPassword) { 
        return next(new ErrorHander("Passwords do not match", 400));
    }

    user.password = req.body.password;
    user.resetpasswordToken = undefined;
    user.resetpasswordExpire = undefined;

    await user.save();
    sendToken(user, 200, res);
});


// get user details
exports.GetUserDetails = catchAsyncError(async (req, res, next) => { 
    const user = await User.findById(req.user.id); 
    if (!user) { 
        return next(new ErrorHander(("User does not exit"), 400));

    }
    return res.status(200).json({ message:"User Details",user });
})

// update user password

exports.UpdateUserPassword = catchAsyncError(async (req, res, next) => { 
    const user = await User.findById(req.user.id).select("+password"); 
    const isPasswordMatched = await user.comparePassword(req.body.oldpassword);
    if (!isPasswordMatched) { 
                return next(new ErrorHander("InValid old password", 401));

    }
    if (req.body.newPassword !== req.body.confirmPassword) { 
                        return next(new ErrorHander("Password does not match", 401));

    }
    user.password = req.body.newPassword;
    console.log("Password updated succesfully");
    await user.save(); 
    sendToken(user, 200, res);

})
// update profile

exports.UpdateProfile = catchAsyncError(async (req, res, next) => { 
    const newUserData = {
        name: req.body.name, 
        email: req.body.email,   
    }
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true, 
        runValidators: true, 
        useFindAndModify: false, 
    })
    res.status(200).json({ message: "Updated Successfully" ,user});
})

// get all users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find(); 
    res.status(200).json({ message: "All users ", users});
});

// get single user details by admin (admin)
exports.getUsersDetailsByAdmin = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id); 
    if (!user) { 
        return next(new ErrorHander(`User does not exist with id: ${req.params.id}`))
    }
    res.status(200).json({ message: "All users ", user});
});


// Update role whether it is user or admin by admin
exports.UpdateRole = catchAsyncError(async (req, res, next) => { 
    const newUserData = {
        name: req.body.name, 
        email: req.body.email, 
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true, 
        runValidators: true, 
        useFindAndModify: false, 
    })
    res.status(200).json({ message: "Updated Role Successfully" ,user});
})


// delete user by admin

exports.DeleteProfile = catchAsyncError(async (req, res, next) => { 
  
    const user = await User.findById(req.params.id);
    if (!user) { 
               return next(new ErrorHander(`user does not exist with this id to delete profile: ${req.params.id}`))
 
    }
    await user.deleteOne();
    res.status(200).json({ message: "Deleted Profile Successfully" });
})

// req.user.id to access that user only
// req.param.id to access user from the database;