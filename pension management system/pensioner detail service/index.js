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

csvFile().fromFile("./pensionerDetails.csv").then(async (response) => {
for (var x = 0; x < response.length; x++) {
const pensioner = await Detail.findOne({ aadhar_no: response[x].aadhar_no });
if (pensioner) 
continue;
const pensionerDetail = new Detail({
name: response[x].name,
DOB: response[x].DOB,
PAN: response[x].PAN,
aadhar_no: response[x].aadhar_no,
salary: response[x].salary,
allowances: response[x].allowances,
pension_type: response[x].pension_type,
bank_details: {
bank_name: response[x].bank_name,
acc_no: response[x].acc_no,
bank_type: response[x].bank_type
},
});
pensionerDetail.save(); 
}

})






// add a new pensioner
app.post("/getPensioner", (req, res) => {
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
  const { aadhaar_no } = req.params;
 
    const response = await Detail.findOne({ aadhaar_no: aadhaar_no });
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