import { Component, OnInit } from '@angular/core';
import Pensioner from 'src/app/Entity/Pensioner';
import { PensionerService } from 'src/app/Services/pensioner.service';

@Component({
  selector: 'app-pensioners',
  templateUrl: './pensioners.component.html',
  styleUrls: ['./pensioners.component.css']
})
export class PensionersComponent implements OnInit {
  pensioners: Pensioner[] = [];
  pensionersCopy: Pensioner[] = [];
  pensioner = "";
  count = 0;

  constructor(public pensionerService: PensionerService) { }

  ngOnInit(): void {
    const promise = this.pensionerService.getPensioners();
    promise.subscribe((response) => {
      console.log(response);
      this.pensioners = response as Pensioner[];
     
        this.pensionersCopy = this.pensioners;
        //this.count++;
      
    })
  }

  deleteRow(pensioner:any, index:any){
    const observables = this.pensionerService.deletePensioner(pensioner, index);
    observables.subscribe((response:any) => {
      console.log(response);
      this.pensioners.splice(index,1)
    })
  }

  newPensioner(event: { target: { value: string; }; }) {
    console.log(event.target.value);
    //console.log(this.pensionersCopy)
    this.pensioner =  event.target.value;
    this.pensioners = this.pensionersCopy;
    //console.log(this.pensioners);

    if (event.target.value == "All")
    {
      const promise = this.pensionerService.getPensioners();
    promise.subscribe((response) => {
      console.log(response);
      this.pensioners = response as Pensioner[];
     
        //this.pensionersCopy = this.pensioners;
        //this.count++;
      
    })
    }

    else if (event.target.value != "All")
    {
      //console.log(this.pensioner);
      var promise = this.pensionerService.getPensionerByAadhaar(this.pensioner);
      promise.subscribe((response) => {
        console.log(response);
        this.pensioners = response as Pensioner[];
        //this.pensionersCopy = this.pensioners;
    })

    }

  
  }

}

