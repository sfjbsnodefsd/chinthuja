
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const bank_details=new Schema({
  acc_no: String,
  bank_name: String,
  bank_type: String
});

const DetailSchema = new Schema({
  name: String,
  DOB:String,
  PAN:String,
  aadhar_no: String , 
  salary:Number,
  allowances:Number,
  pension_type:String,   
  bank_details: String
});

module.exports = Detail = mongoose.model("detail",DetailSchema);


