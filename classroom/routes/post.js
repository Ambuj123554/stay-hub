const express=require("express");
const router=express.Router();
router.get("/",(req,res)=>{
    res.send("get user");
});
router.get("/:id",(req,res)=>{
    res.send("post user");
});
router.post("/",(req,res)=>{
    res.send("edit user");
});
router.delete("/:id",(req,res)=>{
    res.send("delete user");
});

module.exports=router;