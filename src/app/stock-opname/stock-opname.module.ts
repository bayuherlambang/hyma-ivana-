import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule,Validators, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { StockOpnamePageRoutingModule } from './stock-opname-routing.module';

import { StockOpnamePage } from './stock-opname.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    StockOpnamePageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [StockOpnamePage]
})
export class StockOpnamePageModule {}
