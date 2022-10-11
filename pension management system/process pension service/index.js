const express = require("express");
const app = express();
const PORT = process.env.PORT;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const amqp = require("amqplib");
const PensionProcess = require("./PensionProcess");
const isAuthenticated = require("../isAuthenticated");
app.use(express.json());
var channel, connection;
var order;
mongoose.connect(
  "mongodb://localhost:27017/product-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`pension process service DB  Connected`);
    // console.log(pro);
  }
);

async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("PENSIONPROCESS");
}

connect();



app.get("/pensioner detail/Detail", isAuthenticated, async (req, res) => {
  const { aadhar_no } = req.body;
  const pensionprocess = await PensionProcess.find({_aadhar: { $in: aadhar_no }});

  channel.sendToQueue(
    "DETAIL",
    Buffer.from(
      JSON.stringify({
        pensionprocess,
        userEmail: req.user.email,
      })
    )
  );
  channel.consume("PENSIONPROCESS", data => {
    console.log("pension process queue");
     order = JSON.parse(data.content);
     channel.ack(data);
  })
  return res.json(order)
});

app.listen(5001, () => {
  console.log(`pension process service is working at port 5001`);
});