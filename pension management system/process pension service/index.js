const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT||5001;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../isAuthenticated");
const restTemplate = require("rest-template");
const request = require("request");
const app = express();
app.use(express.json());
mongoose.connect(
  "mongodb://localhost:27017/pension-process-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`pension process service DB  Connected`);
   
  }
);

app.post("/pensionprocess", isAuthenticated, async (req, res) => {
  const { aadhaar_no } = req.body;
     let response = await getPensioner(aadhaar_no);
    if (!response.success) {
      throw new Error(response.err);
    }
    const { pension_type, salary, allowances, bank_details } =response;
      
    const pension = getPension(pension_type);
    if (pension === null) {
      console.error("Pension Type not supported");
      
    }

    const Amt = (80 * salary) / 100 + allowances;
    const ServiceCharge = getServiceCharge(bank_details.bank_type);
    if (ServiceCharge === null) {
      console.error(" Bank Type not supported");
     
    }

    return res.status(200).json({success: 1,Detail: {Amt,ServiceCharge}});
  
});

  const getPensioner = (aadhaar_no) =>
  new Promise((resolve, reject) => {
    request(`http://localhost:5002/pensioner/${aadhaar_no}`,{ json: true },(err, res, body) => {
        if (err) {
          console.log(err);
          return reject(err); 
        }
        resolve(body);
      }
    );
  });
const getPension = (pension_type) => {
 var percentage = null;
if(pension_type.toUpperCase()=="SELF") {
  percentage = 80;}
  else if(pension_type.toUpperCase()=="FAMILY") {
  percentage = 50;
  }
  return percentage;
};

const getServiceCharge = (bank_type) => {
var serviceCharge = null;

  if(bank_type.toUpperCase()=="PUBLIC") {
    
      serviceCharge = 500;
  }
 else if(bank_type.toUpperCase()=="PRIVATE") {
      serviceCharge = 550;
      }
  return serviceCharge;
};

app.listen(5001, () => {
  console.log(`pension process service is working at port 5001`);
});