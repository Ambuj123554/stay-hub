const Listing=require("../models/listing");
const Review=require("../models/review");
const User=require("../models/user");


module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password,accountType}=req.body;
        const users=new User({email,username,accountType});
        const registeredUser=await User.register(users,password);

        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wonderlost");
            res.redirect("/listing");
        })
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
};

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Wonderlost");
    const redirect=res.locals.redirectUrl;
    if(redirect){
        res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listing");
    }
};

module.exports.logout=async(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listing");
    });
};