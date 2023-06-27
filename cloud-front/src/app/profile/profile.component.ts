import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/model/user';
import { CognitoService } from '../service/cognito.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
user: IUser = {} as IUser;

constructor(private router: Router, private cognitoService: CognitoService) {}

public ngOnInit(): void {
  this.cognitoService.getUser().then((user)=>{
    this.user = user.attributes;
  }).catch((error)=>{
    alert(error);
  })
}

public update(): void {
  this.cognitoService.updateUser(this.user).then(()=>{
    alert('Account info update successfully');
  }).catch((error)=>{
    alert(error);
  });
}

public signUout(): void {
  this.cognitoService.signOut().then(()=>{
    this.router.navigate(['/login']);
  }).catch((error)=>{
    alert(error);
  })
}
}
