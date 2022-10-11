const express = require("express");
const app = express();
const mongoose = require("mongoose");
const amqp = require("amqplib");
let channel, connection;
  const Detail = require("./Detail")

app.use(express.json());

mongoose.connect(
  "mongodb://localhost:27017/order-service",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`order service DB  Connected`);
    // console.log(pro);
  }
);
async function connect() {
  const amqpServer = "amqp://localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("DETAIL");
}




connect().then(() => {
    channel.consume("DETAIL", data => {
        const {pensionprocess , userEmail} = JSON.parse(data.content);
        const newDetail = createDetail(pensionprocess, userEmail)
        console.log("pensioner detail queue")
        console.log(pensionprocess);;
        channel.ack(data);
        channel.sendToQueue("PENSIONPROCESS", Buffer.from(JSON.stringify({newDetail})));
    })
});

app.listen(5002, () => {
  console.log(`order service is working at port 5002`);
});