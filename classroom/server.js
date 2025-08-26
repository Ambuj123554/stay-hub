const express=require("express");
const app=express();
const user=require("./routes/users.js");
const post=require("./routes/post.js");
// const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.listen(3000,()=>{
    console.log("port is listening");
});
app.use(session({secret:"mysupersecretstring",resave:false,saveUninitialized:true}));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.sumessages=req.flash("success");
    res.locals.ermessages=req.flash("error");
    next();
})

app.get("/register",(req,res)=>{
    let {name="anaymous"}=req.query;
    req.session.name=name;
    if(name=="anaymous"){
        req.flash("error","user not register");
    }else{
        req.flash("success","data saved successfully");
    }
    
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    
    res.render("pages.ejs",{name:req.session.name})
})



// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`send request ${req.session.count} times`);
// })


// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("color","red",{signed:true});
//     res.send("hii");
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verify");
// })
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("madein","india");
    
//     res.send("some cookie");
// })
// app.get("/",(req,res)=>{
    
//     console.log(req.cookies);
//     res.send("hii i am cookie");
// })

// app.get("/greet",(req,res)=>{
//     let {name="anamyous"}=req.cookies;
//     res.send(`hii ${name}`);
// })
// app.use("/",user);
// //index
// app.use("/posts",post);

//post
