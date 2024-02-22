const mongoose = require("mongoose"); 

const Order = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        City: {
            type: String,
            required: true
        },
        State: {
            type: String,
            required: true
        },
        Country: {
            type: String,
            required: true
        },
        PinCode: {
           
            type: String,
            required: true
        },
        PhoneNo: {
            type: Number,
            required: true
        }

    },
    orderItems: [{
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        Image: {
            type: String,
            required: true
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
            required: true,
        }

    }]
    , user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    }
    , paymentInfo: {
        id: {
              type: String,
            required: true
        }, 
        status: {
              type: String,
            required: true
        }

    }, 
    paidAt: {
        type: Date,
        required:true,
    }, 
    itemsPrice:
    {
        type: Number, 
        default:0,
        required:true
    }, 
    TaxPrice:
    {
        type: Number, 
        default:0,
        required:true
    },
    ShippingPrice:
    {
        type: Number, 
        default:0,
        required:true
    },
    TotalPrice:
    {
        type: Number, 
        default:0,
        required:true
    }, 
    OrderStatus: {
        type: String, 
        required: true, 
        default:"processing"
    }, 
    deliveredAt: Date, 
    CreatedAt: {
        type: Date, 
        default: Date.now,
    }
})

module.exports = mongoose.model("Order", Order);