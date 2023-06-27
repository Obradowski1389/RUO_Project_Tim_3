import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-share-data-dialog',
  templateUrl: './share-data-dialog.component.html',
  styleUrls: ['./share-data-dialog.component.css']
})
export class ShareDataDialogComponent {


  fileForm = new FormGroup({
    email: new FormControl('', Validators.required)
  })

  @Output() dialogClosed = new EventEmitter<string>();


  constructor(public dialogRef: MatDialogRef<ShareDataDialogComponent>, private router: Router) {}

  async sendFriendRequest() {
    const email = localStorage.getItem("email");
    const invite = this.fileForm.value.email;
    if(!this.fileForm.valid){
      alert("Email value is required!");
      return;
    }
    if (email == null) {
      this.cancel();
      this.router.navigate(['login']);
      return;
    }

    if(email != null && email == invite!)
    {
      this.cancel();
      alert("You cannot send an invitation to yourself");
      return;
    }
    
    this.dialogClosed.emit(invite!)
    this.cancel();
  }

  cancel() {
    this.dialogRef.close();
  }

}
