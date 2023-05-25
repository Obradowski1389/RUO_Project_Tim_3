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
  filteredDocs : IFile[] = []
  isBackButtonDisabled = true

  constructor(private cognitoService: CognitoService, private router: Router, fileService: FileService) {
    fileService.getAll(this.currentPath).subscribe((res) => { 
      this.allDocs = this.sortedList(res)
      this.pathFileterList()
    })
  }

  getName(file: IFile) {
    const parts = file.name.split('/')
    if (file.isFolder) return parts[parts.length - 1]
    return parts[parts.length - 1] + '.' + file.type
  }

  showDiv = false
  currentPath : string = (localStorage.getItem('username') ?? '') + "/"
  isFileMode = true

  toggleDiv(isFile: boolean): void {
    this.showDiv = true
    if(isFile) this.isFileMode = true
    else this.isFileMode = false
  }

  pathFileterList() {
    this.filteredDocs = []
    for(var i = 0; i < this.allDocs.length; i++) {
      var currDoc : IFile = this.allDocs[i];
      if(currDoc.name.startsWith(this.currentPath)){
        var parts = currDoc.name.replace(this.currentPath, '').split('/')
        if(parts.length == 1) this.filteredDocs.push(currDoc)
      }
    }
  }

  sortedList(docs: IFile[]) {
    return docs.sort((a, b) => {
      const dateA = a.lastModifyDate ? new Date(a.lastModifyDate) : null;
      const dateB = b.lastModifyDate ? new Date(b.lastModifyDate) : null;

      if (dateA && dateB) {
        return dateB.getTime() - dateA.getTime();
      } else if (dateA) {
        return 1;
      } else if (dateB) {
        return -1;
      }
      return 0;
    });
  }

  openFolder(file: IFile) {
    this.currentPath = file.name + '/'
    this.pathFileterList()
    this.isBackButtonDisabled = false
  }

  closeFolder() {
    var parts = this.currentPath.split('/')
    var newPath : string = ''
    for(var i = 0; i < parts.length - 2; i++) newPath += parts[i] + '/'
    this.currentPath = newPath
    this.pathFileterList()
    if(this.currentPath.split('/').length == 2) this.isBackButtonDisabled = true
  }

  getForrmatedCurrentPath() {
    const parts = this.currentPath.split('/')
    var path = 'Root'
    for(var i = 1; i < parts.length; i++) path += ' > ' + parts[i] 
    return path.slice(0, path.length - 2)
  }

  logout() {
    this.cognitoService.signOut()
    this.router.navigate(['/'])
  }
}
