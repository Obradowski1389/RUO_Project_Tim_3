import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CognitoService } from '../service/cognito.service';
import { FileService } from '../service/file.service';
import { InvitationsService } from '../service/invitations.service';

@Component({
  selector: 'app-respond-dialog',
  templateUrl: './respond-dialog.component.html',
  styleUrls: ['./respond-dialog.component.css']
})
export class RespondDialogComponent {

  sender: string = "";
  target: string = "";

  constructor(
    public dialogRef: MatDialogRef<RespondDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private invitationsService: InvitationsService
  ) {
    this.sender = data.sender;
    this.target = data.target;
   }

  accept(){
    this.dialogRef.close();
  }

  decline(){
    this.invitationsService.resolveInvite(this.target, this.sender, false).subscribe({
      next: (value: any) => {
        this.dialogRef.close();
        alert("Sorry to see you leave!");
        this.router.navigate([""]);
      },
      error: (error: any) => {
        console.log(error);
      }
    });
    
  }
}
