import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderCheckPageRoutingModule } from './order-check-routing.module';

import { OrderCheckPage } from './order-check.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OrderCheckPageRoutingModule
  ],
  declarations: [OrderCheckPage]
})
export class OrderCheckPageModule {}
