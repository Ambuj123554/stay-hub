const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Customer","Owner","Admin"],
        default:"Customer",
        required:true,
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);
