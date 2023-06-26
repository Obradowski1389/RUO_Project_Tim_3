import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUser } from 'src/model/user';
import { CognitoService } from '../service/cognito.service';

@Component({
  selector: 'app-confirm-signup',
  templateUrl: './confirm-signup.component.html',
  styleUrls: ['./confirm-signup.component.css']
})
export class ConfirmSignupComponent {
  constructor(private cognitoService: CognitoService, private router: Router,
    private _snackBar: MatSnackBar){
  }
  
  user: IUser = {} as IUser;

  form = new FormGroup({
    code: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required)
  });

  public confirmSignUp(): void {
    this.user.email = this.form.value.email!;
    this.user.code = this.form.value.code!;
    this.cognitoService.confirmSignUp(this.user).then(()=>{
      this._snackBar.open("Successful verification", "OK", {duration: 5000});
      this.router.navigate(['login']);
    }).catch((error)=>{
      alert(error);
    })  
  }

}
