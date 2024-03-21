const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js")
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {isLoggedin} = require("../middleware.js");
const UserController = require("../controllers/user.js")


router.route("/login")

.get(wrapAsync(UserController.loginPage))
.post(
saveRedirectUrl,
passport.authenticate('local', { failureRedirect:"/login" ,failureFlash:true }) , 
wrapAsync(UserController.userLogin)
)


router.get("/logout", 
UserController.userLogout);

router.route("/signup")

.get(wrapAsync(UserController.signupPage))       
.post(wrapAsync(UserController.userRegister)) 

module.exports= router;