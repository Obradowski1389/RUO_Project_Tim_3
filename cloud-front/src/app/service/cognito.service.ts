import { Injectable } from '@angular/core';
import { Amplify, Auth } from 'aws-amplify';
import { environment } from '../../environments/environment';
import { IUser } from '../../model/user';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class CognitoService {

  constructor(private client: HttpClient) { 
    Amplify.configure({
      Auth:environment.cognito
    });
  }

  signUp(user: IUser):Promise<any> {

    return Auth.signUp({
      username: user.email,
      password: user.password,
      // attributes: [
      //   {
      //     name: 'name',
      //     value: user.name
      //   },
      //   {
      //     name: 'surname',
      //     value: user.surname
      //   },
      //   {
      //     name: 'email',
      //     value: user.email
      //   },
      //   {
      //     name: "birthday",
      //     value: new Date(user.birthday).toISOString()
      //   },
      // ]
    });
  }

  confirmSignUp(user: IUser):Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  login(user: IUser): Promise<any> {
    return Auth.signIn(user.email, user.password);
  }

  getUser(): Promise<any> {
    return Auth.currentAuthenticatedUser()
      .then((user) => {return user})
      .catch((error) => {
        console.log('No user authenticated:', error);
        return null; 
      });
  }

  updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser().then((cognitoUser: any)=>{
      return Auth.updateUserAttributes(cognitoUser, user);
    })
  }

  signOut(): Promise<any> {
    localStorage.clear();
    sessionStorage.clear();
    return Auth.signOut()
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('username') != null) return true
    return false
  }
  
}
