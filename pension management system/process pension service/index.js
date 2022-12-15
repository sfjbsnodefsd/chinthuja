const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT||5001;
const mongoose = require("mongoose");
const amqp = require("amqplib");
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../isAuthenticated");
const Pensioner = require('./Pension');
const app = express();
app.use(express.json());
var channel, connection;
var pensionAmt = 0;
var serviceCharge=0;
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
async function connect(){
  const amqpServer = "amqp://localhost:5672"
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("PENSION")
}
function createPension(pensioners, aadhaarNo){
  //let newAmt = 0;
  console.log(pensioners[0].pension_type);
 
    if (pensioners[0].pension_type == "Self")
    {
      pensionAmt  = (pensioners[0].salary * 0.8) + pensioners[0].allowances
    }
    else if (pensioners[0].pension_type == "Family")
    {
      pensionAmt  = (pensioners[0].salary * 0.5) + pensioners[0].allowances
    }

    if (pensioners[0].bank_details.bank_type == "Public")
    {
       serviceCharge = 500;
    }
    else if (pensioners[0].bank_details.bank_type == "Private")
    {
       serviceCharge = 550;
    }
   console.log(pensionAmt);
  
  const newPension = new Pensioner({
    pensioners,
    pensionAmt: pensionAmt,
    serviceCharge: 500
});
newPension.save();
return newPension;
}

connect().then(() => {
channel.consume("PENSION", data => {
  const {pensioners} = JSON.parse(data.content);
  const newPension = createPension(pensioners, pensionAmt)
    console.log(pensioners[0]);
  console.log("Pension amount = "+pensionAmt);
  console.log("Bank Service Charge = "+serviceCharge);
  channel.ack(data);
  channel.sendToQueue("PENSIONER", Buffer.from(JSON.stringify({newPension})));
})
});

app.listen(5002, () => {
  console.log(`pension process service is working at port 5002`);
});