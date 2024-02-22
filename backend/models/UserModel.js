const mongoose = require("mongoose"); 
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const User = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxlength: [30, "Name should have less than 30 characters"],
        minlength: [4, "Name should have more than 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Enter your Password"],
        minlength: [8, "Name should have more than 8 characters"],
        select: false

    },
    avatar:
    {
        publicId: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }
    ,
    role: {
        type: String,
        default: "user"
    },
    resetpasswordToken: String,
    resetpasswordExpire: Date,

});
// before saving user schema just bcrypt the password
User.pre("save", async function (next) { // function ka use kr rhe h bcz there is no this keyword ib arrow function

    if (!this.isModified("password")) { // if the client change the password then only use bycrpt otherwise dont do any
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);

})
// jwt token


User.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

//  compare password correct or not
User.methods.comparePassword = async function (enteredPassword) { 
    return await bcrypt.compare(enteredPassword, this.password);
}


// reset password
User.methods.getResestPasswordToken= function () { 
//  generate token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // hashing and adding to userschema
    this.resetpasswordToken = crypto.createHash("sha256")
        .update(resetToken).digest("hex");
    this.resetpasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}

module.exports = mongoose.model("User", User);