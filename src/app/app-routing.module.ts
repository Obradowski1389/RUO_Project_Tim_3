import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ConfirmSignupComponent } from './confirm-signup/confirm-signup.component';
import { FileSystemComponent } from './file-system/file-system.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signUp', component:SignUpComponent},
  {path: 'profile', component:ProfileComponent},
  {path: 'confirmSignUp', component:ConfirmSignupComponent},
  {path: 'filesystem', component:FileSystemComponent},
  {path: '', pathMatch: 'full', redirectTo:'signUp'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
