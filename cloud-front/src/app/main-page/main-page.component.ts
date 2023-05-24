import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from 'src/cognito.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  constructor(private cognitoService: CognitoService, private router: Router) {}

  showDiv = false;

  toggleDiv() {
    this.showDiv = !this.showDiv;
  }

  t() {
    console.log('javljeno');
    
  }

  logout() {
    this.cognitoService.signOut()
    this.router.navigate(['/'])
  }
}
