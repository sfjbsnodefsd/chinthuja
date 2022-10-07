const ex=require("express");
const Course = require("../models/course");
const router=ex.Router();
/*creating my routes
router.get("/courses",(req,res)=>{
    res.send("Your courses are the following")
})*/

router.get("/allcourses",async(req,res)=>{
    try{
        const courses=await Course.find();
        res.json(courses);
    }
    catch(err){
res.json(err);
    }
});

router.post("/addcourse",async(req,res)=>{
    try{
      const course= await Course.create(req.body);
      res.json(course);
    } catch (err) {
        res.json(err)
    }
 })

 router.delete("/delete/:courseId",async(req,res)=>{
try{
    await Course.remove({_id: req.params.courseId });
    res.status(200).json({
        message: "deleted successfully",
    });
}catch(error){
    res.send(error);
}
 });
 router.put("/update/:courseId",async(req,res)=>{
         const courseId= req.params.courseId;
      try{
        const course= await Course.updateOne({_id: courseId},req.body);
        res.json(course);
      } catch (err) {
          res.json(err)
      }
   })

module.exports=router;

