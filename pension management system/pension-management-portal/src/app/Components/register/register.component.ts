import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import User from 'src/app/Entity/User';
import { UserService } from 'src/app/Services/user.service';
import { first } from 'rxjs';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  title = "Register User";
  form!: FormGroup;
  loading = false;
  formsubmit = false;
  returnURL!: string;
  public user: User={
    name:'',
    email:'',
    password:''
  };

  

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnURL = this.route.snapshot.queryParams['returnURL'] || '/';
  }
  get f() { return this.form.controls; }

  save()
  {
    this.formsubmit = true;

    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.user.name = this.f['name'].value;
    this.user.email = this.f['email'].value;
    this.user.password = this.f['password'].value;
    console.log(this.user);
    const observables = this.userService.registerUser(this.user);
    observables.subscribe(
      (response: any) => {
        console.log(response);
      },
       (error) => {
        console.log(error);
        this.loading = false;
      }
    );
    window.location.href="/";
  }

 

}
