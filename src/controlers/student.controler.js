
const express=require("express");
const route=express.Router();


const Student=require("../models/student.model")




app.get("/students",async(req,res)=>{

    try{
    const student=await Student.find().lean().exec();
     return res.status(200).send(student);
    }
    catch(err){
       return res.status(500).send("Something went wrong");
    }
    
    })



module.exports=route;