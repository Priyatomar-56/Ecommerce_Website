const express = require("express");
const { registerUser, loginUser, logoutUser, ForgotPassword  ,ResetPassword, GetUserDetails, UpdateUserPassword, UpdateProfile , getAllUsers, getUsersDetailsByAdmin, DeleteProfile, UpdateRole} = require("../controllers/User");
const router = express.Router();
const { isAuthenticated , authorizeRoles} = require('../middleware/auth');

router.route("/register").post(registerUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").get(logoutUser);
router.route("/password/forgot").post(ForgotPassword);
router.route("/password/reset/:token").put(ResetPassword);
router.route("/me/getDetails").get(isAuthenticated, GetUserDetails);
router.route("/password/update").put(isAuthenticated, UpdateUserPassword);
router.route("/user/profileUpdate").put(isAuthenticated, UpdateProfile);
router.route("/admin/getSingleUsers/:id").get(isAuthenticated, authorizeRoles("admin") , getUsersDetailsByAdmin);
router.route("/admin/Allusers").get(isAuthenticated, authorizeRoles("admin"), getAllUsers);
router.route("/admin/UpdateRolebyAdmin/:id").put(isAuthenticated, authorizeRoles("admin"), UpdateRole);
router.route("/admin/DeleteUserByadmin/:id").delete(isAuthenticated, authorizeRoles("admin"), DeleteProfile);

module.exports = router;