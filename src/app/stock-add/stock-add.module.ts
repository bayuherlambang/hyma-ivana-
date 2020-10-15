import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { FormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockAddPageRoutingModule } from './stock-add-routing.module';

import { StockAddPage } from './stock-add.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    StockAddPageRoutingModule
  ],
  declarations: [StockAddPage]
})
export class StockAddPageModule {}
