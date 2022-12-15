import { Component, OnInit } from '@angular/core';
import Pensioner from 'src/app/Entity/Pensioner';
import { PensionerService } from 'src/app/Services/pensioner.service';

@Component({
  selector: 'app-add-pensioner',
  templateUrl: './add-pensioner.component.html',
  styleUrls: ['./add-pensioner.component.css']
})
export class AddPensionerComponent implements OnInit {
  
  title = "Fill out the form below";
  validForm = false;
  public pensioner: Pensioner={
    name:'',
   DOB:'',
   PAN:'',
    aadhaarNo:0,
    salary:0,
    allowances:0,
    pension_type:'',
    bank_details: {
      bank_name: '',
      acc_no: '',
      bank_type:''
    }
  };
 

  save()
  {
    console.log(this.pensioner);
    if(this.pensioner.name != "" && this.pensioner.DOB != "" && this.pensioner.PAN != "" && this.pensioner.aadhaarNo != 0 && this.pensioner.salary != 0 &&
    this.pensioner.allowances != 0 && this.pensioner.pension_type != "" && this.pensioner.bank_details.bank_name != "" && this.pensioner.bank_details.acc_no != "" && this.pensioner.bank_details.bank_type != "")
    {
      const observables = this.pensionerService.savePensioner(this.pensioner);
      observables.subscribe(
        (response: any) => {
          console.log(response);
        },
        function (error: any) {
          console.log(error);
        }
      );
      alert("Pensioner successfully created");
      this.pensioner ={
        name:'',
       DOB:'',
        PAN:'',
        aadhaarNo:0,
        salary:0,
        allowances:0,
        pension_type:'',
        bank_details: {
          bank_name: '',
          acc_no: '',
          bank_type:''
        }
      }
      }
      else {
        alert("Please fill out all fields");
      }
    }
    constructor(private pensionerService: PensionerService) { }

  ngOnInit(): void {
  }

}
  