const Listing=require("./models/listing");

const isloggedIn=(req,res,next)=>{
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};

// Middleware to check if user can create/manage listings (Owner or Admin only)
const canManageListings=(req,res,next)=>{
    if(!req.user || (req.user.accountType !== 'Owner' && req.user.accountType !== 'Admin')){
        req.flash("error","Only property owners and admins can create/manage listings!");
        return res.redirect("/listing");
    }
    next();
};

// Middleware to check if user is owner of the listing or admin
const isOwner=async(req,res,next)=>{
    try{
        let {id}=req.params;
        let listing=await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing not found!");
            return res.redirect("/listing");
        }
        if(!listing.owner.equals(req.user._id) && req.user.accountType !== 'Admin'){
            req.flash("error","You don't have permission to perform this action!");
            return res.redirect(`/listing/${id}`);
        }
        next();
    }catch(err){
        req.flash("error","Something went wrong!");
        return res.redirect("/listing");
    }
};

module.exports = isloggedIn;
module.exports.isloggedIn = isloggedIn;
module.exports.canManageListings = canManageListings;
module.exports.isOwner = isOwner;

module.exports.saveredirect=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};



