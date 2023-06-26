import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CognitoService } from 'src/cognito.service';
import { IUser } from 'src/model/user';
import { RespondDialogComponent } from '../respond-dialog/respond-dialog.component';

@Component({
  selector: 'app-family-sign-up',
  templateUrl: './family-sign-up.component.html',
  styleUrls: ['./family-sign-up.component.css']
})
export class FamilySignUpComponent {
  user: IUser = {} as IUser;
  signUpForm = new FormGroup({
    inviter: new FormControl("", [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    birthday: new FormControl(null, [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  maxDate: Date = new Date();

  constructor(private router: Router, private cognitoService: CognitoService, private dialog: MatDialog) {
    this.maxDate = new Date();
    
  }

  ngOnInit(){
    const dialogRef = this.dialog.open(RespondDialogComponent);
    
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

