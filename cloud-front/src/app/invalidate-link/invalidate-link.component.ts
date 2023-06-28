import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from '../service/file.service';

@Component({
  selector: 'app-invalidate-link',
  templateUrl: './invalidate-link.component.html',
  styleUrls: ['./invalidate-link.component.css']
})
export class InvalidateLinkComponent {

  constructor(private router: Router, private fileService: FileService) {}

  ngOnInit() {
    const urlParams = new URLSearchParams(window.location.search);
    const dynamoID = urlParams.get('id');
    console.log(dynamoID);
    this.fileService.invalidateLink(dynamoID!).subscribe((res) => {
      console.log(res);
      alert('Link Invalidated');
    }, (err) => {
      console.log(err);
      alert('Error While Trying To Invalidate');
    });
    this.router.navigate(['/']);
  }
}
