import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileCreateDTO, IFile } from 'src/model/file';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-add-modify',
  templateUrl: './add-modify.component.html',
  styleUrls: ['./add-modify.component.css']
})
export class AddModifyComponent {

  constructor(private fileService: FileService) {}

  @Input() currentPath : string | null = ''
  @Output() buttonClicked = new EventEmitter<void>() 

  fileForm = new FormGroup({
    file: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)]),
    description: new FormControl(''),
    tagsInput: new FormControl('')
  })

  fileName: string = ''
  file!: File
  fileBase64 : string = ''

  onFileSelected(event: any) {
    this.file = event.target.files[0]
    this.fileName = this.file.name
    this.convertFileToBase64()
  }

  convertFileToBase64() {
    if (this.file) {
      const reader = new FileReader();
      reader.onloadend = () => { this.fileBase64 = reader.result as string }
      reader.readAsDataURL(this.file)
    }
  }
  

  tags: string[] = [];
  newTag: string = '';

  addItem(event: Event) {
    event.preventDefault();
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue.trim() !== '') {
      this.tags.push(inputValue.trim());
      (event.target as HTMLInputElement).value = '';
    }
  }
  
  removeItem(index: number): void {
    if (index >= 0 && index < this.tags.length) {
      this.tags.splice(index, 1);
    }
  }

  cancel() {
    this.buttonClicked.emit()
  }

  createName(name: string) : string {
    return this.currentPath + '/' + name
  } 
  
  createFile() {
    if(!this.fileForm.valid) return
    if(this.fileName == '') {
      alert("File is required!")
      return
    }    
    
    var formValues = this.fileForm.value;
    const currentDate = new Date();
    const timezoneOffset = new Date().getTimezoneOffset();

    var file : FileCreateDTO = {
      name: this.createName(formValues.name != null ? formValues.name : ''),
      type: this.fileName.split('.')[1],
      isFolder: false,
      size: this.file.size,
      createDate: new Date(currentDate.getTime() - timezoneOffset * 60000),
      lastModifyDate: new Date(currentDate.getTime() - timezoneOffset * 60000),
      description: formValues.description != null ? formValues.description : '',
      tags: this.tags,
      file: this.fileBase64
    }

    this.fileService.create(file).subscribe({next: (res) => console.log(res)})
    this.buttonClicked.emit()
  }
}