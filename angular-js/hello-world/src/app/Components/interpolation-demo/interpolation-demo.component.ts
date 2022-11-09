import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interpolation-demo',
  templateUrl: './interpolation-demo.component.html',
  styleUrls: ['./interpolation-demo.component.css']
})
export class InterpolationDemoComponent implements OnInit {

  name:string= "Nishant";
  lang:string= "Javascript"


  printAddress() {
    return "I live in Bangalore, Inia"
  }

  constructor() { }

  ngOnInit(): void {
  }

}
