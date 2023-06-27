import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-download-data-from-invite',
  templateUrl: './download-data-from-invite.component.html',
  styleUrls: ['./download-data-from-invite.component.css']
})
export class DownloadDataFromInviteComponent {
  
  constructor(private router: Router, private fileService: FileService) {}
  
  ngOnInit(){
    const urlParams = new URLSearchParams(window.location.search);
    const isFolder = urlParams.get('isFolder');
    const id = urlParams.get('target');  
    const type = urlParams.get('type');  
    console.log("IsFolder: ", isFolder); 
    console.log("Target: ", id);
    if (isFolder == "True"){

    } else if (isFolder == "False") {
      this.fileService.download(id!).subscribe((res) => {
        console.log(res);
        const items = id!.split('/');
        const lastItem = items[items.length - 1];
        this._download(res.value, lastItem, this.getMimeType('.' + type))
      }, (err) => {
        console.log(err);
      })
    } else {
      alert("Easter egg xD")
    }
    this.router.navigate(['/']);
  }

  _download(res: any, fn: string, extension: string) {
    let data = this.base64ToFile(res, fn, extension);
    let element = document.createElement('a');
    window.URL = window.URL || window.webkitURL;
    element.setAttribute('href', window.URL.createObjectURL(data));
    element.setAttribute('download', data.name);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
    
  base64ToFile(base64data: string, myFileNameWithdotExtension: string, fileType: string): File {
    const content = window.atob(base64data);
    const fileName = myFileNameWithdotExtension;
    const type = fileType;
    const uint8Array = new Uint8Array(content.length);
    
    for (let i = 0; i < content.length; i++) {
      uint8Array[i] = content.charCodeAt(i);
    }
    
    const blob = new Blob([uint8Array], { type });
    return new File([blob], fileName, { lastModified: new Date().getTime(), type });
  }

  getMimeType(fileExtension: string): string {
    const mimeTypeMap: Record<string, string> = {
      // Add more extensions and corresponding MIME types as needed
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        '.xls': 'application/vnd.ms-excel',
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        '.txt': 'text/plain',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
    };
    return mimeTypeMap[fileExtension.toLowerCase()];
  }
}
