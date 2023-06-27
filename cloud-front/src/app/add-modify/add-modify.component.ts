import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileCreateDTO, IFile, fromFileCreateDTOToIFile } from 'src/model/file';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-add-modify',
  templateUrl: './add-modify.component.html',
  styleUrls: ['./add-modify.component.css']
})
export class AddModifyComponent {

  constructor(private fileService: FileService) {}

  @Input() currentPath : string | null = ''
  @Input() isFileMode : boolean = true
  @Input() exestedDocs : IFile[] = []
  @Output() buttonClicked = new EventEmitter<void>() 
  @Output() fileDTO = new EventEmitter<IFile>

  //forms
  fileForm = new FormGroup({
    file: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)]),
    description: new FormControl(''),
    tagsInput: new FormControl('')
  })

  folderForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+$/)])
  })

  //files
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
  
  //tags
  tags: string[] = []
  newTag: string = ''

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

  clearForms() {
    this.file
    this.fileBase64 = ''
    this.fileName = ''
    this.fileForm.setValue({
      name: '',
      description: '',
      tagsInput: '',
      file: ''
    })
    this.fileForm.get('name')?.setErrors(null)
    this.folderForm.setValue({name: ''})
    this.folderForm.get('name')?.setErrors(null)
    this.tags = []
    this.folderForm.value.name = ''
  }

  cancel() {
    this.buttonClicked.emit()
    this.clearForms()
  }

  isNameValid(name: string) {
    return !this.exestedDocs.some(item => item.name == name);
  }
  
  createFile() {
    if(!this.fileForm.valid) return
    var formValues = this.fileForm.value
    var name = this.currentPath + (formValues.name != null ? formValues.name : '')

    if(!this.isNameValid(name)) {
      alert("File with this name already exist in this directory!")
      return
    }
    if(this.fileName == '') {
      alert("File is required!")
      return
    }    
    
    const currentDate = new Date();
    const timezoneOffset = new Date().getTimezoneOffset();

    var file : FileCreateDTO = {
      name: name,
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
    this.fileService.sendNotification(localStorage.getItem('email')!, "File: " + this.fileName + " - Successfully Created").subscribe({next: (res) => console.log(res)});
    this.buttonClicked.emit()
    this.fileDTO.emit(fromFileCreateDTOToIFile(file))
    this.clearForms()
  }

  createFolder() {
    if(!this.folderForm.valid) return
    var formValues = this.folderForm.value;
    var name = this.currentPath + (formValues.name != null ? formValues.name : '')

    if(!this.isNameValid(name)) {
      alert("Folder with this name already exist in this directory!")
      return
    }

    var folder : FileCreateDTO = {
      name: this.currentPath + (formValues.name != null ? formValues.name : ''),
      type: null,
      isFolder: true,
      size: 0,
      createDate: null,
      lastModifyDate: null,
      description: null,
      tags: [],
      file: null
    }
    
    this.fileService.create(folder).subscribe({next: (res) => console.log(res)})
    this.fileService.sendNotification(localStorage.getItem('email')!, "Folder: " + formValues.name + " - Successfully Created").subscribe({next: (res) => console.log(res)});
    this.buttonClicked.emit()
    this.fileDTO.emit(fromFileCreateDTOToIFile(folder))
    this.clearForms()
  }

}