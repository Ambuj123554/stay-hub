if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}


const express=require("express");
const app=express();

const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const path=require("path");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");   
app.set("view engine","ejs");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.engine("ejs",ejsMate);
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const listing=require("./routes/listing.js");

const reviews=require("./routes/review.js");
const user=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

main()
.then(()=>{
    console.log("connection successfully");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(process.env.Atlas_db);
}
const store=MongoStore.create({
    mongoUrl:process.env.Atlas_db,
    crypto:{
        secret:process.env.Secret,
    },
    touchAfter:24*3600,//in seconds
})
store.on("error",()=>{
    console.log("error in mongo session",err);
})

const sessionOption=({
    store,
    secret:process.env.Secret,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
});

app.listen(8080,(req,res)=>{
    console.log("port is listening");
})
// app.get("/",(req,res)=>{
//     res.send("working");
// })

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currUser=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    
    
    next();
})

// app.get("/demo",async(req,res)=>{
//     let fake=new User({
//         email:"student123@gmail.com",
//         username:"studen",
//     })
//     let regi=await User.register(fake,"hello");
//     res.send(regi);
// })

app.use("/listing",listing);


app.use("/listing/:id/reviews",reviews);
app.use("/",user);
// app.use("/",reviews);//parent router

// app.get("/testlisting",async (req,res)=>{
//     const listing=new Listing({
//         title:"My new villa",
//         description:"very beautiful place",
//         price:1500,
//         location:"panji Goa",
//         country:"India",
//     });
//     await listing.save();
//     console.log("saved");
//     res.send("saved");
// })
const listingValidate=((req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let {errmsg}=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }
    else{
        next();
    }
})




app.post("/listing",listingValidate,wrapAsync(async(req,res,next)=>{
    
    // let{title,description,image,price,location,country}=req.body;
    let listings=req.body.listing;
    
    // let list={
    //     title:title,
    //     description:description,
    //     image:image,
    //     price:price,
    //     location:location,
    //     country:country,
    // }
    let listing=await Listing.insertOne(listings);
    req.flash("success","New Listing added");
    res.redirect("/listing");
}));



app.get("/listing",wrapAsync(async(req,res)=>{
    let {category}=req.query;
    let filter={};
    if(category){
        filter.category=category;
    }
    let list=await Listing.find(category);
    res.render("index.ejs",{list});
}))



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



//shi krna hai
// app.all("*",(req,res,next)=>{
//     next(new ExpressError(404,"Page not found!"));
// })
app.use((err,req,res,next)=>{
    let{status=404,message="Page not Found!"}=err;
    res.status(status).render("error.ejs",{message});
})

