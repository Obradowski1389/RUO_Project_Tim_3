import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileService } from '../service/file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-friend-dialog',
  templateUrl: './add-friend-dialog.component.html',
  styleUrls: ['./add-friend-dialog.component.css']
})
export class AddFriendDialogComponent {


  fileForm = new FormGroup({
    email: new FormControl('', Validators.required)
  })

  constructor(public dialogRef: MatDialogRef<AddFriendDialogComponent>, private fileService: FileService, private router: Router) {}

  sendFriendRequest() {
    const username = localStorage.getItem('username');
    if (username == null) {
      this.cancel();
      this.router.navigate(['login']);
    }
    this.fileService.shareRepositoryInvitation(username!, this.fileForm.value.email!).subscribe(
      (res) => {
        console.log(res);
        this.dialogRef.close();
        alert("Request successfully sent");
      }, (error) => {
        console.log(error);
      }
    )
  }

  cancel() {
    this.dialogRef.close();
  }

}
