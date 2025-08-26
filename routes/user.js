const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const {saveredirect}=require("../middleware.js");
const users=require("../controllers/users.js");
router.get("/signup",(req,res)=>{
    
    res.render("./users/signup.ejs");
});


router.route("/signup")
.get((req,res)=>{
    
    res.render("./users/signup.ejs");
})
.post(wrapAsync(users.signup))



// router.post("/signup",wrapAsync(users.signup));

router.route("/login")
.get((req,res)=>{
    res.render("users/login.ejs");
})
.post(saveredirect,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(users.login))




// router.get("/login",(req,res)=>{
//     res.render("users/login.ejs");
// });

// router.post("/login",saveredirect,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),wrapAsync(users.login));

router.get("/logout",wrapAsync(users.logout));

module.exports=router;