import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/model/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FileService } from '../service/file.service';
import { IFile } from 'src/model/file';
import { CognitoService } from '../service/cognito.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: IUser = {} as IUser;

  constructor(private router: Router, private cognitoService: CognitoService, private fileService: FileService) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  public login(): void {
    let form = this.loginForm.value;
    this.user.email = form.email!;
    this.user.password = form.password!;
    this.cognitoService.login(this.user).then((res)=>{
      console.log(res);
      localStorage.setItem('username', res.username);
      localStorage.setItem('email', this.user.email);

      this.fileService.getFamily(localStorage.getItem("email")!).subscribe({
        next: (value: any) => {
          sessionStorage.setItem("familyUsername", value.username);
          this.router.navigate(['/home']);

        }, 
        error: (error: any) => {
          console.log(error);
          if(error.status == 404)
            this.router.navigate(['/home']);

        }
      });

    }).catch((error)=>{
      alert(error);
    })
  }
}
