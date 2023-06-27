import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/model/user';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { CognitoService } from '../service/cognito.service';

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
    username: new FormControl('', [Validators.required]),
    birthday: new FormControl(null, [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  maxDate: Date = new Date();

  constructor(private router: Router, private cognitoService: CognitoService) {
    this.maxDate = new Date();
  }
  public ngOnInit() {
  }

  public signUp(): void {
    let form = this.signUpForm.value;
    this.user.email = form.email!;
    this.user.name = form.name!;
    this.user.surname = form.surname!;
    this.user.birthday = form.birthday!;
    this.user.password = form.password!;
    this.user.username = form.username!;

    this.cognitoService.signUp(this.user).then(()=>{
      this.router.navigate(['confirmSignUp']);
// Acc created
    }).catch((error)=>{
      alert(error);
    })


  }
}
