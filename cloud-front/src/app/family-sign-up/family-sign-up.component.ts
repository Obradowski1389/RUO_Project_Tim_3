import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IUser } from 'src/model/user';
import { RespondDialogComponent } from '../respond-dialog/respond-dialog.component';
import { CognitoService } from '../service/cognito.service';
import { FileService } from '../service/file.service';
import { InvitationsService } from '../service/invitations.service';

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

  targetEmail: string = "";
  senderEmail: string = "";

  constructor(private router: Router, private invitationsService: InvitationsService, private cognitoService: CognitoService,private dialog: MatDialog) {
    this.maxDate = new Date();
    
  }

  ngOnInit(){
    const urlParams = new URLSearchParams(window.location.search);
    const sender64 = urlParams.get('send');
    const target64 = urlParams.get("target");
    const user64 = urlParams.get("u");
    if(sender64 != null) this.senderEmail = atob(sender64!);
    if(target64 != null) this.targetEmail = atob(target64!);
    if(user64 != null) sessionStorage.setItem("familyUsername",atob(user64));

    const dialogRef = this.dialog.open(RespondDialogComponent, {data: {sender: this.senderEmail, target: this.targetEmail}});
    
  }

  public signUp(): void {
    let form = this.signUpForm.value;
    this.user.email = form.email!;
    this.user.name = form.name!;
    this.user.surname = form.surname!;
    this.user.birthday = form.birthday!;
    this.user.password = form.password!;
    this.user.username = form.username!;

    this.invitationsService.resolveInvite(this.user.email, form.inviter!, true).subscribe({
      next: (val: any) => {
        console.log(val);
        this.cognitoService.signUp(this.user).then(()=>{
          this.router.navigate(["confirmSignUp"]);
        }).catch((error)=>{
          alert(error);
        })
      },
      error: (error: any) => {
        alert(error.error.message);
        console.log(error);
      }
    });
    
  }
}

