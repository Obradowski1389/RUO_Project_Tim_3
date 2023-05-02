import { Component } from '@angular/core';
import { CognitoService } from 'src/cognito.service';
import { S3Service } from '../s3.service';

@Component({
  selector: 'app-file-system',
  templateUrl: './file-system.component.html',
  styleUrls: ['./file-system.component.css']
})
export class FileSystemComponent {
  constructor(private s3Service: S3Service, private cognito: CognitoService) { }


  onFileSelect(e: any) {
    this.cognito.getUser().then((user)=>{
      console.log(user)
    }).catch((error)=>{
      console.log(error);
    })
    this.s3Service.uploadFile(e.target.files[0]);
  }

  downloadFile() {
    this.s3Service.getAllFiles();
  }
}
