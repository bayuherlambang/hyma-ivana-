import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule,Validators, FormControl } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidasiheadsetPageRoutingModule } from './validasiheadset-routing.module';

import { ValidasiheadsetPage } from './validasiheadset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ValidasiheadsetPageRoutingModule
  ],
  declarations: [ValidasiheadsetPage]
})
export class ValidasiheadsetPageModule {}
