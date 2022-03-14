const express=require("express")
const mongoose=require("mongoose")
const User=require("./models/user.model");
const route=require("./controlers/user.controler");


const app=express();
app.use(express.json())

const connect=()=>{

    return mongoose.connect(
        "mongodb+srv://KanishkaRajput:khushy1234@cluster0.516ub.mongodb.net/MVC?retryWrites=true&w=majority"
        )
}

app.use("/users",route);



//studentschema
const studentSchema=new mongoose.Schema({

userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
},
rollid:{type:Number,required:true,unique:true},
currentBatch:{type:String,required:true}

},
{
    timestamps:true,
    versionKey:false
});

//studentmodel
const Student=mongoose.model("student",studentSchema);


//bathcschema
const batchSchema=new mongoose.Schema({
batchname:{type:String,required:true,unique:true},
studentId:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"student",
    required:true
}],

},
{
    timestamps:true,
    versionKey:false
})

//batchmodel

const Batch=mongoose.model("batch",batchSchema);

//evaluationschema
const evaluationSchema=new mongoose.Schema({

dateofevaluation:{type:String,required:true},
instructorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
},
batchId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"batch",
    required:true
}
},{
    timestamps:true,
    versionKey:false
})

//evalution model--
const Evaluation=mongoose.model("evaluation",evaluationSchema);


//submitionsSchema
const submissionSchema=new mongoose.Schema({

evaluationId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"evaluation",
    required:true
}
,
studentId:{
type:mongoose.Schema.Types.ObjectId,
ref:"students",
required:true
}
,
Marks:{type:Number,required:true}

},
{
    timestamps:true,
    versionKey:false
})


//submitionmodel
const Submission=mongoose.model("submission",submissionSchema)

// app.get("/users",async(req,res)=>{

// try{
// const user=await User.find().lean().exec();
//  return res.status(200).send(user);
// }
// catch(err){
//    return res.status(500).send(err.message);
// }

// })

app.get("/students",async(req,res)=>{

    try{
    const student=await Student.find().lean().exec();
     return res.status(200).send(student);
    }
    catch(err){
       return res.status(500).send("Something went wrong");
    }
    
    })
app.get("/batchs",async(req,res)=>{
    try{
const batch=await Batch.find().populate({
    path:"studentId",
    select:{userId:1}
}).
lean().exec();
return res.send(batch);

    }catch(err){
        return res.status(500).send(err.message); 
    }
})


app.get("/evaluations",async(req,res)=>{
    try{
const batch=await Evaluation.find().populate({

path:"instructorId",
select:{firstname:1}


}).populate({
    path:"batchId",
    select:{batchname:1}
})
.lean().exec();
return res.send(batch);

    }catch(err){
        return res.status(500).send(err.message); 
    }
})




app.get("/submissions",async(req,res)=>{
    try{
const batch=await Submission.find().populate({

path:"evaluationId",
select:{dateofevaluation:1}


})
.lean().exec();
return res.send(batch);

    }catch(err){
        return res.status(500).send(err.message); 
    }
})


app.post("/submissions",async(req,res)=>{

    try{
    const user=await Student.create(req.body);
     return res.status(200).send(user);
    }
    catch(err){
       return res.status(500).send(err.message);
    }
    
    });

    


    app.get("/evaluations/:id",async(req,res)=>{
        try{
    const batch=await Evaluation.findById(req.params.id).populate({
    
    path:"instructorId",
    select:{firstname:1}
    
    
    }).populate({
        path:"batchId",
        select:{studentId:1}
    })
    .lean().exec();
    return res.send(batch);
    
        }catch(err){
            return res.status(500).send(err.message); 
        }
    });

    app.get("/maxmarks",async(req,res)=>{
        try{
    const batch=await Submission.findById().sort({Marks:-1}).limit(1).populate({
    
    path:"evaluationId",
    select:{dateofevaluation:1}
    
    
    })
    .lean().exec();
    return res.send(batch);
    
        }catch(err){
            return res.status(500).send(err.message); 
        }
    });
    
app.listen(4888,async()=>{
    try{
await connect();
console.log("i am porting");
    }catch(err){
        console.log("err:"+" "+err);
    }
});

