const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5002;
const Detail = require("./Detail");
const csvFile=require("csvtojson");
app.use(express.json());

mongoose.connect(
  "mongodb://localhost:27017/pensioner-detail-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },() => {
    console.log(`pensioner detail service DB  Connected`);
   
  }
);

csvFile().fromFile("./pensionerDetails.csv").then(async (res) => {
for (var x = 0; x < res.length; x++) {
const pensioner = await Detail.findOne({ aadhar_no: res[x].aadhar_no });
if (pensioner) 
continue;
const pensionDetail = new Detail({
name: res[x].name,
DOB: res[x].DOB,
PAN: res[x].PAN,
aadhar_no: res[x].aadhar_no,
salary: res[x].salary,
allowances: res[x].allowances,
pension_type: res[x].pension_type,
bank_details: {
bank_name: res[x].bank_name,
acc_no: res[x].acc_no,
bank_type: res[x].bank_type
},
});
pensionDetail.save(); 
}
})

app.post("/postPensioner", (req, res) => {
  const {name,DOB,PAN,aadhaar_no,salary,allowances,pension_type,bank_details} = req.body;

  const newPensioner = new Detail({
    name,
    DOB,
    PAN,
    aadhaar_no,
    salary,
    allowances,
    pension_type,
    bank_details,
  });

  newPensioner.save()
    .then((value) =>
      res.status(200).json({ success: 1, createdPensioner: newPensioner })
    )
    .catch((err) =>
      res.status(500).json({ success: 0, message: "Some error occured", err: err })
    );
});

app.get("/getPensioner/:aadhaar_no", async (req, res) => {
  
 
    const response = await Detail.findOne({ aadhaar_no: req.params.aadhaar_no });
    if(!response) {
      throw new Error('No data found for provided aadhaar number');
    }
       res.status(200).json({
      success: 1,
      pensioner:response,
    });
  
  }
);



app.listen(5002, () => {
  console.log(`pensioner detail service is working at port 5002`);
});