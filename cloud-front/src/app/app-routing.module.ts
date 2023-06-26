import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ConfirmSignupComponent } from './confirm-signup/confirm-signup.component';
import { MainPageComponent } from './main-page/main-page.component';
import { AuthGuardService } from './guard/auth.guard.service';
import { FamilySignUpComponent } from './family-sign-up/family-sign-up.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signUp', component:SignUpComponent},
  {path: 'profile', component:ProfileComponent},
  {path: 'confirmSignUp', component:ConfirmSignupComponent},
  {path: 'home', component:MainPageComponent, canActivate: [AuthGuardService]},
  {path: "familyRegistration", component: FamilySignUpComponent},
  {path: '', pathMatch: 'full', redirectTo:'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
