import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FileCreateDTO, FileMoveDTO } from 'src/model/file';

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
<<<<<<< Updated upstream
=======

  download(name: string, type: string): Observable<any> {
    return this.client.post<any>(environment.host + 'download', {'name': name, 'type': type})
  }

  modify(id: string, name: string, description: string, tags: string[], isFolder: boolean) {
    return this.client.put<any>(environment.host + 'update', { 'id': id, 'name': name, 'description': description, 'isFolder': isFolder, 'tags': tags})
  }
>>>>>>> Stashed changes
}
