import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-respond-dialog',
  templateUrl: './respond-dialog.component.html',
  styleUrls: ['./respond-dialog.component.css']
})
export class RespondDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RespondDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router
  ) { }

  accept(){
    // TODO accept invitation notification
    this.dialogRef.close();
  }

  decline(){
    // TODO decline invitation notification
    this.dialogRef.close();
    alert("Sorry to see you leave!");
    this.router.navigate([""]);
  }
}
