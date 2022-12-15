const express = require("express");
//require("dotenv").config();
const app = express();
const isAuthenticated = require("../isAuthenticated");
const mongoose = require("mongoose");
const amqp = require("amqplib");
const PORT = process.env.PORT || 5002;
const Detail = require("./Pensioner");
var csv = require('csvtojson');
const cors = require('cors');
const Pensioner = require("./Pensioner");
app.use(cors());
app.use(express.json());
var channel, connection;
mongoose.connect("mongodb://localhost:27017/pensioner-detail-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }, () => {
    console.log(`pensioner detail service DB  Connected`);
    csv().fromFile("./pensionerData/pensionerDetails.csv").then(async (res) => {
        for (var x = 0; x < res.length; x++) {
          const pensioner = await Pensioner.findOne({ aadhaarNo: res[x].aadhaarNo });
          if (pensioner)
            continue;
        
          console.log("Insert function");
          const pensionDetail = new Pensioner({
            name: res[x].name,
            DOB: res[x].DOB,
            PAN: res[x].PAN,
            aadhaarNo: res[x].aadhaarNo,
            salary: res[x].salary,
            allowances: res[x].allowances,
            pension_type: res[x].pension_type,
            bank_details: {
              acc_no: res[x].acc_no,
              bank_name: res[x].bank_name,
              bank_type: res[x].bank_type
            },
          });
          pensionDetail.save();
          
        }
      })
  }
);



async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("PENSIONER");
}

connect();
app.post("/pensioner/create",  async (req, res) => {
  const { name, DOB, PAN, aadhaarNo, salary, allowances, pension_type, bank_details } = req.body;

  const newPensioner = new Pensioner({

    name,
    DOB,
    PAN,
    aadhaarNo,
    salary,
    allowances,
    pension_type,
    bank_details,
  });

  newPensioner.save()
  return res.json(newPensioner);
});

app.get("/pensioner/:aadhaarNo", async (req, res) => {

  try {
    const pensioner = await Pensioner.findOne({ aadhaarNo: req.params.aadhaarNo }, req.body);
    res.json(pensioner);
  } catch (error) {
    res.json(error);
  }
});
app.delete("/delete/:aadhaarNo", async (req, res) => {
  try {
    await Pensioner.remove({ aadhaarNo: req.params.aadhaarNo });
    res.status(200).json({
      message: "deleted sucessfully",
    });
  } catch (error) {
    res.send(error);
  }
});

app.put("/update/:aadhaarNo", async (req, res) => {
  const aadhaar = req.params.aadhaarNo;

  try {
    const pensioner = await Pensioner.updateOne({ aadhaarNo: aadhaarNo }, req.body);
    res.json(pensioner);
  } catch (error) {
    res.json(error);
  }
});
app.post("/pension/create/:aadhaarNo", isAuthenticated, async (req, res) => {

  const pensioners = await Pensioner.findOne({ aadhaarNo: req.params.aadhaarNo }, req.body);

  channel.sendToQueue(
    "PENSION",
    Buffer.from(
      JSON.stringify({
        pensioners,
        aadhaarNo: req.user.aadhaarNo,
      })
    )
  );
  channel.consume("PENSIONER", data => {
    pension = JSON.parse(data.content);
    channel.ack(data);
  })

});



app.listen(5001, () => {
  console.log(`pensioner detail service is working at port 5001`);
});