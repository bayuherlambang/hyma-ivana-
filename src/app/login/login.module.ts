import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
      IonicStorageModule.forRoot(),
      CommonModule,
      FormsModule,
      IonicModule,
      ReactiveFormsModule,
      LoginPageRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
