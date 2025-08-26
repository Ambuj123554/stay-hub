const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

main()
.then(()=>{
    console.log("connection successfully");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlost");
}

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"688d0c455207dbd5bf0c0777"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();