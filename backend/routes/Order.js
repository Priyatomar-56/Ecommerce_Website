const express = require("express"); 
const router = express.Router();
const { NewOrder, SingleOrder , MyOrders,GetAllOrdersByAdmin, UpdateOrder, DeleteOrder}= require("../controllers/OrderController")
const {isAuthenticated, authorizeRoles }= require("../middleware/auth")

router.route("/order/new").post(isAuthenticated, NewOrder);
router.route("/order/MyOrders").get(isAuthenticated, MyOrders);
router.route("/order/getSingleOrder/:id").get(isAuthenticated, SingleOrder);
router.route("/admin/order/getSingleOrder").get(isAuthenticated, authorizeRoles("admin"), GetAllOrdersByAdmin);
router.route("/admin/order/updateOrder/:id").put(isAuthenticated, authorizeRoles("admin"), UpdateOrder);
router.route("/admin/order/deleteOrder/:id").delete(isAuthenticated, authorizeRoles("admin"), DeleteOrder)


module.exports = router;