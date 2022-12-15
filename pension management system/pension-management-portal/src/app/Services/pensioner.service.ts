import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
const BASE_URL1 = "http://localhost:5001/allpensioners";
const BASE_URL3 = "http://localhost:5001/pensioner/create";
const BASE_URL4 = "http://localhost:5001/delete";



@Injectable({
  providedIn: 'root'
})
export class PensionerService {
  
  baseurl2 = "http://localhost:5001/pensioner/";

  getPensioners() {
    return this.http.get(BASE_URL1);
  }

  getPensionerByAadhaar(aadhaarNo: Number) {
    this.baseurl2 = this.baseurl2.concat(aadhaarNo);
    return this.http.get(this.baseurl2);
  }

  savePensioner(pensioner:{aadhaarNo:Number;
    name: String,
    DOB:String,
    PAN:String,
    salary:Number,
    allowances:Number,
    pension_type:String,   
    bank_details:{
    acc_no: String,
    bank_name: String,
    bank_type: String
     
    }}) {
      return this.http.post(BASE_URL3, pensioner);
    }

    deletePensioner(pensioner: { aadhaarNo: Number; }, index: any) {
      return this.http.delete(BASE_URL4+'/'+ pensioner.aadhaarNo);
    }

  

  constructor(private http:HttpClient) { }
}
