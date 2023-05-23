import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IFile } from 'src/model/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private client: HttpClient) { }

  create(file: IFile) {
    return this.client.post<any>('https://x2fsxmrsw8.execute-api.eu-central-1.amazonaws.com/Prod/create', file)
  }
}
