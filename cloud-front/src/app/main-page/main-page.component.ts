import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/cognito.service';
import { FileService } from '../service/file.service';
import { FileMoveDTO, IFile } from 'src/model/file';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  allDocs : IFile[] = []
  filteredDocs : IFile[] = []
  isBackButtonDisabled = true
  showDiv = false
  isFileMode = true
  currentPath : string = (localStorage.getItem('username') ?? '') + "/"

  constructor(private cognitoService: CognitoService, private router: Router, private fileService: FileService, public dialog: MatDialog) {
    fileService.getAll(this.currentPath).subscribe((res) => { 
      this.allDocs = this.sortedList(res)
      this.pathFileterList()
    })
  }

  //list manipulations
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
      const dateA = a.lastModifyDate ? new Date(a.lastModifyDate) : null
      const dateB = b.lastModifyDate ? new Date(b.lastModifyDate) : null
      if (dateA && dateB) return dateB.getTime() - dateA.getTime()
      else if (dateA) return 1
      else if (dateB) return -1
      return 0
    });
  }

  //show folder
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

  //create
  whenCreatedNewDoc(item: IFile) {
    this.allDocs.unshift(item)
    this.allDocs = this.sortedList(this.allDocs)
    this.pathFileterList()
  }

  //delete
  delete(file: IFile) {
    this.fileService.delete(file.id, file.name, file.isFolder).subscribe((res) => { 
      const index = this.allDocs.indexOf(file)
      if (index !== -1)  this.allDocs.splice(index, 1)
      this.pathFileterList()
    })
  }

  //move
  openMoveDialog(file: IFile): void {
    const dialogRef = this.dialog.open(MoveDialog, { data: { directories: this.getAvailableFolders(file) } });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var parts = file.name.split('/')
        var fileMove: FileMoveDTO = {id: file.id, name: result + '/' + parts[parts.length - 1]}
        console.log(fileMove)
        this.fileService.move(fileMove).subscribe((res) => { 
          console.log(res)
          const index = this.allDocs.indexOf(file)
          if (index !== -1)  this.allDocs.splice(index, 1)
          file.name = fileMove.name
          this.allDocs.push(file)
          this.pathFileterList()
        })
      }
    });
  }

  getAvailableFolders(file: IFile) {
    var goodDirectories: string[] = [] 
    for(var i = 0; i < this.allDocs.length; i++) {
      var currDoc = this.allDocs[i]
      if(currDoc.isFolder && !this.isNameAlreadyExist(file.name, currDoc.name)) goodDirectories.push(currDoc.name) 
    }
    var root: string = localStorage.getItem('username') ?? ''
    if(!this.isNameAlreadyExist(file.name, root)) goodDirectories.push(root)
    return goodDirectories
  }

  isNameAlreadyExist(docName: string, folderName: string) {
    var fileParts = docName.split('/')
    var newName = folderName + '/' + fileParts[fileParts.length - 1]
    for(var i in this.allDocs) if(this.allDocs[i].name == newName) return true
    return false
  }

  //logout
  logout() {
    this.cognitoService.signOut()
    this.router.navigate(['/'])
  }

  //helpers
  toggleDiv(isFile: boolean): void {
    this.showDiv = true
    if(isFile) this.isFileMode = true
    else this.isFileMode = false
  }

  getForrmatedCurrentPath() {
    const parts = this.currentPath.split('/')
    var path = 'Root'
    for(var i = 1; i < parts.length; i++) path += ' > ' + parts[i] 
    return path.slice(0, path.length - 2)
  }

  getName(file: IFile) {
    const parts = file.name.split('/')
    if (file.isFolder) return parts[parts.length - 1]
    return parts[parts.length - 1] + '.' + file.type
  }
}

@Component({
  selector: 'reject-dialog',
  templateUrl: 'move-dialog.html',
})
export class MoveDialog {
  selectedDirectory: string = ''
  directories: string[] = []

  constructor(
    public dialogRef: MatDialogRef<MoveDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.directories = data.directories
    this.selectedDirectory = data.directories[0]
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

  onYesClick() {
    this.dialogRef.close(this.selectedDirectory)
  }

  getFormatedName(name: string) {
    var root: string = localStorage.getItem('username') ?? ''
    return name.replace(root, 'Root')
  }
}