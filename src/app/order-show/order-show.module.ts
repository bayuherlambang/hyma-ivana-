import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderShowPageRoutingModule } from './order-show-routing.module';

import { OrderShowPage } from './order-show.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderShowPageRoutingModule
  ],
  declarations: [OrderShowPage]
})
export class OrderShowPageModule {}
