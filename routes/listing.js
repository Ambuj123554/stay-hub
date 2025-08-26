const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");  
const isloggedIn=require("../middleware.js");
const isOwner=require("../middleware.js"); 
const user=require("../routes/user.js");
const listinguser=require("../controllers/listing.js");
const multer=require('multer');
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});

const listingValidate=((req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let {errmsg}=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
});


//index
// router.get("/",wrapAsync(listinguser.index));

//new route
router.get("/new",isloggedIn,(req,res)=>{
    
    res.render("new.ejs");
})

router.route("/")
.get(wrapAsync(listinguser.index))
// .post(isloggedIn,listingValidate,wrapAsync(listinguser.new))
.post(isloggedIn,
  upload.single("listing[image]"),
  listingValidate,
  wrapAsync(listinguser.new)
)

//show
// router.get("/:id",wrapAsync(listinguser.show));

// router.post("/",isloggedIn,listingValidate,wrapAsync(listinguser.new));



//edit and update
router.get("/:id/edit",isloggedIn,listingValidate,wrapAsync(listinguser.edit));


router.route("/:id")
.get(wrapAsync(listinguser.show))
.put(isloggedIn,upload.single("listing[image]"),wrapAsync(listinguser.update))
.delete(isloggedIn,wrapAsync(listinguser.delete))




// router.put("/:id",isloggedIn,wrapAsync(listinguser.update));

//delete
// router.delete("/:id",isloggedIn,wrapAsync(listinguser.delete));



module.exports=router;