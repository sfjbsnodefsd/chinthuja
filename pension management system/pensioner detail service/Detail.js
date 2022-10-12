
const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const DetailSchema = new Schema({
    name: String,
    email: String,
    password: String,
    PAN:String,
  aadhar_no: String ,    
    bank_details: {
        acc_no: String,
        bank_name: String,
        bank_type:String
    }
});

module.exports = Detail = mongoose.model("detail",DetailSchema);


