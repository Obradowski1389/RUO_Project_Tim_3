import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-add-friend-dialog',
  templateUrl: './add-friend-dialog.component.html',
  styleUrls: ['./add-friend-dialog.component.css']
})
export class AddFriendDialogComponent {


  fileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('')
  })

  constructor(public dialogRef: MatDialogRef<AddFriendDialogComponent>, private fileService: FileService) {}

  sendFriendRequest() {

  }

  cancel() {
    this.dialogRef.close();
  }

  sendRequest() {

  }
}
