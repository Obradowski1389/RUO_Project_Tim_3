import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/environments/material/material.module';
import { ConfirmSignupComponent } from './confirm-signup/confirm-signup.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MainPageComponent, MoveDialog } from './main-page/main-page.component';
import { AddModifyComponent } from './add-modify/add-modify.component';
import { ModifyDataDialogComponent } from './modify-data-dialog/modify-data-dialog.component';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { FamilySignUpComponent } from './family-sign-up/family-sign-up.component';
import { RespondDialogComponent } from './respond-dialog/respond-dialog.component';
import { ShareDataDialogComponent } from './share-data-dialog/share-data-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    ProfileComponent,
    ConfirmSignupComponent,
    MainPageComponent,
    AddModifyComponent,
    MoveDialog,
    ModifyDataDialogComponent,
    AddFriendDialogComponent,
    FamilySignUpComponent,
    RespondDialogComponent,
    ShareDataDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [ReactiveFormsModule, MaterialModule]
})
export class AppModule { }
