import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileCreateDTO, FileMoveDTO, IFile } from 'src/model/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private client: HttpClient) { }

  create(file: FileCreateDTO) {
    return this.client.post<any>(environment.host + 'create', file)
  }

  getAll(username: string) {
    return this.client.get<any>(environment.host + username)
  }

  move(file: FileMoveDTO) {
    return this.client.put<any>(environment.host + 'move', file)
  }

  delete(id: string, name: string, isFolder: boolean) {
    return this.client.put<any>(environment.host + 'delete', {'id' : id, 'name' : name, 'isFolder': isFolder})
  }

  download(name: string){
    return this.client.post<any>(environment.host + 'download', {'name': name})
  }

  modify(id: string, name: string, description: string, tags: string[], isFolder: boolean) {
    return this.client.put<any>(environment.host + 'update', { 'id': id, 'name': name, 'description': description, 'isFolder': isFolder, 'tags': tags})
  }

  sendNotification(receiver: string, placeholder: string) {
    return this.client.post<any>(environment.host + 'notify', {'placeholder': placeholder, 'targetEmail': receiver})
  }

  shareRepositoryInvitation(senderEmail: string, targetEmail: string) {
    return this.client.post<any>(environment.host + 'invite', { 'senderEmail': senderEmail, 'targetEmail': targetEmail});
  }

  shareFF(file: IFile, to: string) {
    return this.client.post<any>(environment.host + 'shareFile', { 'name': file.name, 'type': file.type, 'isFolder': file.isFolder, 'to': to, 'from': localStorage.getItem('email')});
  }

  claimFF(id: string) {
    return this.client.post<any>(environment.host + '', {});
  }

  downloadDataFromInvite() {

  }
}
