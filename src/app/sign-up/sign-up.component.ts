import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/cognito.service';
import { IUser } from 'src/model/user';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  isConfirmed: boolean = false;
  user: IUser = {} as IUser;
  responseError: boolean = false;

  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.pattern("^(\\+381)?(0)?6(([0-6]|[8-9])\\d{7}|(77|78)\\d{6}){1}$")]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private router: Router, private cognitoService: CognitoService) {

  }
  public ngOnInit() {
    // this.user.email = 'isomidobradovic@gmail.com';
    // this.user.password = "Test$1234";
    // this.user.code = '923717';
    this.confirmSignUp();
  }

  public signUp(): void {
    this.cognitoService.signUp(this.user).then(()=>{
// Acc created
    }).catch((error)=>{
      alert(error);
    })
  }

  public confirmSignUp(): void {
    this.cognitoService.confirmSignUp(this.user).then(()=>{
      this.router.navigate(['login']);
    }).catch((error)=>{
      alert(error);
    })  
  }
}
