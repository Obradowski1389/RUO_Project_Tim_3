import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(private client: HttpClient) { }

  helloWorld() {
    return this.client.get<string>("https://bbe7mssfxl.execute-api.eu-central-1.amazonaws.com/Prod/hello");
  }
  
}
