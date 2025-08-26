const mongoose=require("mongoose");
const Review = require("./review.js");
const { required } = require("joi");
const {Schema}=mongoose;
const listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    owner: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        
    },
    category:{
        type:String,
        // enum:["mountain","boats","arctic","pool","castles","cities","camping","farms","domes","trending","rooms"],
        required:true,
    },
});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({id:{$in:listing.reviews}});
    }
})

// const Listing=mongoose.model("Listing",listingSchema);
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;