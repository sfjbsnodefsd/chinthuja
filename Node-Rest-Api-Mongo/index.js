const express=require("express")
const coursesRouter=require("./routes/courses")
require("dotenv").config();
const mongoose =require('mongoose')
const bodyParser =require("body-Parser")

const app=express();
app.use(bodyParser.json());
app.use(coursesRouter);
//app.get("/courses",coursesRouter);


/*
app.get("/",(req,res)=>{
    res.send("Api is working fine")
})*/

mongoose.connect(process.env.DB_CONNECTION_URL,()=>{
    console.log("Connected to the db successfully");
})


app.listen(process.env.PORT,()=>{
//app.listen(5000,() =>{
    console.log("server is starting");
})