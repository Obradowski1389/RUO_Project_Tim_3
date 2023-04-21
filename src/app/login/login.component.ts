import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/cognito.service';
import { IUser } from 'src/model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: IUser = {} as IUser;

  constructor(private router: Router, private cognitoService: CognitoService) {}

  public login(): void {
    this.cognitoService.login(this.user).then(()=>{
      this.router.navigate(['/']);
    }).catch((error)=>{
      alert(error);
    })
  }
}
