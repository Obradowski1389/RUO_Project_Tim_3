import { Injectable } from '@angular/core';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { HttpClient } from '@angular/common/http';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { CognitoService } from '../../src/cognito.service'

@Injectable({
  providedIn: 'root'
})
export class S3Service {


  bucket = 'cloudcomputingprojectbucket';


  constructor(private http: HttpClient, private cognito: CognitoService) {
    AWS.config.region = 'eu-central-1';
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'eu-central-1:946e46da-5be3-47da-9f2d-493fcf99f545'
    });
   }

   s3 = new S3({
    apiVersion: '2006-03-01'
  });

   async uploadFile(file: File) {

    const params = {
      Bucket: this.bucket,
      Key: file.name,
      Body: file,
      ContentType: file.type
    };

    try {
      const response = this.s3.putObject(params, function(err, data){
        console.log(err, data);
      });
      console.log("SUCCESS", response);
    } catch(error) {
      alert("FAILURE" + error);
    }
  }

  getAllFiles(): void {
    this.cognito.getUser().then((result)=>{
      const sub = result.attributes.sub;

      const params = {
        Bucket: this.bucket,
        Prefix: sub      // User ID
      }
      try {
        const that = this;
        this.s3.listObjectsV2(params, function(err, data) {
            console.log(err);
        })
      } catch(error) {
        alert(error);
      }
    });
  }
}
