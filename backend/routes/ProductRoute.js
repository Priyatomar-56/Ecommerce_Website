const express = require("express");
const { getProducts , createProduct, updateProduct ,deleteProduct, getProductDetails , CreateProductReview , DeleteReviews, GetAllReviews} = require("../controllers/Product");
const { isAuthenticated , authorizeRoles} = require("../middleware/auth");
const router = express.Router();

router.route("/getproducts").get( getProducts);
router.route("/product/getdetails/:id").get(getProductDetails);
router.route("/admin/product/new").post(isAuthenticated, authorizeRoles("admin"),createProduct);
router.route("/admin/product/:id").put(isAuthenticated, authorizeRoles("admin"),updateProduct);
router.route("/admin/productdelete/:id").delete(isAuthenticated, authorizeRoles("admin"), deleteProduct);
router.route("/reviews").put(isAuthenticated, CreateProductReview);
router.route("/getallreviews").get(GetAllReviews).delete(isAuthenticated, DeleteReviews);
module.exports = router