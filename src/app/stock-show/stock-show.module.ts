import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StockShowPageRoutingModule } from './stock-show-routing.module';

import { StockShowPage } from './stock-show.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StockShowPageRoutingModule
  ],
  declarations: [StockShowPage]
})
export class StockShowPageModule {}
