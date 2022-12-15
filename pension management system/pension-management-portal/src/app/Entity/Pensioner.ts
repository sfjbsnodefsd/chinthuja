export default interface Pensioner {
    name: String,
    DOB:String,
    PAN:String,
    aadhaarNo:Number,
    salary:Number,
    allowances:Number,
    pension_type:String,   
    bank_details:{
    acc_no: String,
    bank_name: String,
    bank_type: String
     
    }
  
}