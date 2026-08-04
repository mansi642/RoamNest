const express=require("express");
const router=express.Router({mergeParams:true});
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const {redirectURL}=require("../middleware.js");
const userController=require("../controllers/users.js")

router.route("/register")
  .get(userController.signUpForm)
  .post(wrapAsync(userController.signUp));

router.route("/login")
  .get(userController.loginForm)
  .post(redirectURL, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;