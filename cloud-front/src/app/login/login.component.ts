import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/cognito.service';
import { IUser } from 'src/model/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HelperService } from '../service/helper.service';
import { FileService } from '../service/file.service';
import { IFile } from 'src/model/file';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  user: IUser = {} as IUser;

  constructor(private router: Router, private cognitoService: CognitoService, private helper: HelperService, private fileService: FileService) {
    this.helper.helloWorld().subscribe({next: (res) => console.log(res)})
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  public login(): void {
    let form = this.loginForm.value;
    this.user.email = form.email!;
    this.user.password = form.password!;
    this.cognitoService.login(this.user).then(()=>{
      this.router.navigate(['/']);
    }).catch((error)=>{
      alert(error);
    })
  }

  testCreation() {
    const currentDate = new Date();
    const timezoneOffset = new Date().getTimezoneOffset();

    var file : IFile = {
      name: 'Test3',
      type: 'txt',
      isFolder: true,
      size: 200,
      createDate: new Date(currentDate.getTime() - timezoneOffset * 60000),
      lastModifyDate: new Date(currentDate.getTime() - timezoneOffset * 60000),
      description: 'mega test',
      tags: ['bb']
    }
    this.fileService.create(file).subscribe({next: (res) => console.log(res)})
  }
}
