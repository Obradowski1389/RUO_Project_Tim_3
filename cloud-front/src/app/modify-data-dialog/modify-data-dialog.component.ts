import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IFile } from 'src/model/file';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-modify-data-dialog',
  templateUrl: './modify-data-dialog.component.html',
  styleUrls: ['./modify-data-dialog.component.css']
})
export class ModifyDataDialogComponent {

  isFileMode: boolean = false;
  tags: string[] = [];
  fileName: string = '';
  prefix: string = '';

  fileForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)]),
    description: new FormControl(''),
    tagsInput: new FormControl('')
  })

  folderForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)])
  })

  constructor(public dialogRef: MatDialogRef<ModifyDataDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: IFile, 
              private fileService: FileService) {
    this.isFileMode = !data.isFolder; 
   }

  ngOnInit() {
    console.log(this.data.name);
    if(this.isFileMode) {
      let tagStr = '';
      for(var elem of this.data.tags) {
        tagStr += elem;
      }
      this.fileForm.setValue({
        name: this.parseName(this.data.name),
        description: this.data.description,
        tagsInput: tagStr,
      })
    } else {
      this.folderForm.setValue({
        name: this.data.name
      })
    }
  }

  parseName(name: string): string {
    const items = name.split('/');
    const parsed = items[items.length - 1];
    const temp = items.filter(item => item !== parsed);
    for (var x of temp) {
      this.prefix += x;
    }
    return parsed;
  }

  modifyFileName() {
    const newName = this.prefix + '/' + this.fileForm.value.name;
    this.fileService.modify(this.data.id, newName, this.fileForm.value.description!, this.tags, false).subscribe(
      (res) => {
        console.log(res);
        this.fileService.sendNotification(localStorage.getItem('email')!, 'File: ' + this.fileForm.value.name + ' - Successfully Updated').subscribe(
          (res) => {
            console.log(res);
          }
        )
        this.closeDialog();
    }, (error) => {
        console.log(error);
        this.closeDialog();
        alert("Error try again later");
    })
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  addTag(event: Event) {
    event.preventDefault()
    const inputValue = (event.target as HTMLInputElement).value
    if (inputValue.trim() !== '') {
      this.tags.push(inputValue.trim());
      (event.target as HTMLInputElement).value = ''
    }
  }

  removeTag(index: number): void {
    if (index >= 0 && index < this.tags.length) this.tags.splice(index, 1)
  }
}
