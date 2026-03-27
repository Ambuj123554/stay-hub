const mongoose=require("mongoose");
const {Schema}=mongoose;

const bookingSchema=new mongoose.Schema({
    listing:{
        type:Schema.Types.ObjectId,
        ref:"Listing",
        required:true,
    },
    customer:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    customerName:{
        type:String,
        required:true,
    },
    numberOfDays:{
        type:Number,
        required:true,
        min:1,
    },
    numberOfRooms:{
        type:Number,
        required:true,
        min:1,
    },
    roomType:{
        type:String,
        enum:["Premium","AC","NON AC","Executive","Presidential"],
        required:true,
    },
    checkInDate:{
        type:Date,
        required:true,
    },
    checkOutDate:{
        type:Date,
        required:true,
    },
    totalAmount:{
        type:Number,
        required:true,
    },
    bookingDate:{
        type:Date,
        default:Date.now,
    },
    status:{
        type:String,
        enum:["Confirmed","Cancelled","Completed"],
        default:"Confirmed",
    }
});

const Booking=mongoose.model("Booking",bookingSchema);
module.exports=Booking;