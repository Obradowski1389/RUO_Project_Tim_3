import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/cognito.service';
import { FileService } from '../service/file.service';
import { IFile } from 'src/model/file';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  allDocs : IFile[] = []

  constructor(private cognitoService: CognitoService, private router: Router, fileService: FileService) {
    fileService.getAll(this.currentPath).subscribe((res) => { this.allDocs = res})
  }

  getName(file: IFile) {
    const parts = file.name.split('/')
    return parts[parts.length - 1] + '.' + file.type
  }

  showDiv = false;
  currentPath : string = localStorage.getItem('username') ?? ''

  toggleDiv(): void {
    this.showDiv = !this.showDiv;
  }

  getForrmatedCyrrentPath() {
    const parts = this.currentPath.split('/')
    var path = 'Root'
    for(var i = 1; i < parts.length; i++) path += ' > ' + parts[i] 
    return path
  }

  logout() {
    this.cognitoService.signOut()
    this.router.navigate(['/'])
  }
}
