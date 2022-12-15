import { Component, OnInit } from '@angular/core';
import Pensioner from 'src/app/Entity/Pensioner';
import { PensionerService } from 'src/app/Services/pensioner.service';

@Component({
  selector: 'app-process-pensioner',
  templateUrl: './process-pensioner.component.html',
  styleUrls: ['./process-pensioner.component.css']
})
export class ProcessPensionerComponent implements OnInit {
  pensioners: Pensioner[] = [];
  pensionersCopy: Pensioner[] = [];
  pensioner = "";

  constructor(public pensionerService: PensionerService) { }

  ngOnInit(): void {
    
    const promise = this.pensionerService.getPensioners();
    promise.subscribe((response) => {
      console.log(response);
      this.pensionersCopy = response as Pensioner[];
     
       
        //this.count++;
      
    })
  }

  newPensioner(event) {
    console.log(event.target.value);
    //console.log(this.pensionersCopy)
    this.pensioner =  event.target.value;
    //this.pensioners = this.pensionersCopy;
    //console.log(this.pensioners);

    
      //console.log(this.pensioner);
      var promise = this.pensionerService.getPensionerByAadhaar(this.pensioner);
      promise.subscribe((response) => {
        console.log(response);
        this.pensioners = response as Pensioner[];
        //this.pensionersCopy = this.pensioners;
    })

    

  
  }

  calcPension(pensioner:any, index:any){
    console.log(pensioner.aadhaar);
    let pensionAmount = 0;
    let bankServiceCharge = 0;
    if (pensioner.selfOrFamily == "Self")
    {
        pensionAmount = (pensioner.salary * 0.8) + pensioner.allowances
    }
    else if (pensioner.selfOrFamily == "Family")
    {
        pensionAmount = (pensioner.salary * 0.5) + pensioner.allowances
    }

    if (pensioner.bankDetails.publicOrPrivate == "Public")
    {
        bankServiceCharge = 500;
    }
    else if (pensioner.bankDetails.publicOrPrivate == "Private")
    {
        bankServiceCharge = 550;
    }
    //pensionAmount = newPensionAmount;
    console.log(pensionAmount);
    console.log(bankServiceCharge);
    alert("Details for "+pensioner.name+"\nPension Amount: "+pensionAmount+"\nBank Service Charge: "+bankServiceCharge);
  }

}
