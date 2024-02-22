const Order = require("../models/OrderModel");
const catchAsyncError = require("../middleware/catchAsyncError")
const ErrorHander = require("../utils/ErrorHandler");
const Product = require("../models/ProductModels");

// create new order
exports.NewOrder = catchAsyncError(async (req, res, next) => {
    const { shippingInfo, orderItems, TotalPrice, paymentInfo, itemsPrice, TaxPrice, ShippingPrice } = req.body;
    
    const order = await Order.create({
        shippingInfo, orderItems, TotalPrice, paymentInfo, itemsPrice, TaxPrice, ShippingPrice, paidAt: Date.now(),
        user: req.user._id,
    })

    res.status(201).json({ message: "Order done successfully", order });
});
// get single order

exports.SingleOrder = catchAsyncError(async (req, res, next) => { 
    const order = await Order.findById(req.params.id).populate("user", "name email");// by using populate ya user vale database m jakar vah se name aur email le lagae
    if (!order) { 
        return next(new ErrorHander("Order is not availabe", 404));
    }
    res.status(200).json({message:"Got the desired order",order})
})

// get logged in user orders
exports.MyOrders = catchAsyncError(async (req, res, next) => { 
    const order = await Order.find({ user: req.user._id });
    res.status(200).json({message:"Got the desired order",order})
})

// get all orders --Admin
exports.GetAllOrdersByAdmin = catchAsyncError(async (req, res, next) => { 
    const order = await Order.find();
    let totalAmount = 0;
    order.forEach(order => { 
        totalAmount += order.TotalPrice;
    })
    res.status(200).json({message:"Got the desired order",order, totalAmount})
})

// Update OrderStatus -- Admin
exports.UpdateOrder = catchAsyncError(async (req, res, next) => { 
    const order = await Order.findById(req.params.id);
      if (!order) { 
        return next(new ErrorHander("Order is not availabe to Update", 404));
    }
    if (order.OrderStatus === "Delivered") { 
        return next(new ErrorHander("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async order => {
        await updateStock(order.product, order.quantity)
    });
    order.OrderStatus = req.body.status;
    if (req.body.status === "Delivered") { 
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });

    res.status(200).json({message:"Got the desired order",order})
})

async function updateStock(id, quantity) { 
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}

// // delete Order -- Admin
exports.DeleteOrder = catchAsyncError(async (req, res, next) => { 
    const order = await Order.findById(req.params.id);
    if (!order) { 
        return next(new ErrorHander("Order is not availabe to delete", 404));
    }
    await order.deleteOne();

    res.status(200).json({ message: "Deleted order successfully" });
})
