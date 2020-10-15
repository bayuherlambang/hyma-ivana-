import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPreparePageRoutingModule } from './order-prepare-routing.module';

import { OrderPreparePage } from './order-prepare.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OrderPreparePageRoutingModule
  ],
  declarations: [OrderPreparePage]
})
export class OrderPreparePageModule {}
