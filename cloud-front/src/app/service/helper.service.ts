import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private client: HttpClient) { }

  helloWorld() {
    return this.client.get<string>(environment.host + 'hello');
  }
  
}
