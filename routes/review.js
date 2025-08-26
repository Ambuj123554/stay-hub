const express=require("express");
const router=express.Router({mergeParams:true});
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");   
const Review=require("../models/review.js");
const isloggedIn=require("../middleware.js");
const reviewuser=require("../controllers/review.js");
const reviewValidate=((req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let {errmsg}=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
})

//posting review
router.post("/",isloggedIn,wrapAsync(reviewuser.new));


//delete review//nhi ho rha
router.delete("/:reviewId",isloggedIn,reviewValidate,wrapAsync(reviewuser.delete))

module.exports=router;