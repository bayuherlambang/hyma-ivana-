import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarangKeluarPageRoutingModule } from './barang-keluar-routing.module';

import { BarangKeluarPage } from './barang-keluar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BarangKeluarPageRoutingModule
  ],
  declarations: [BarangKeluarPage]
})
export class BarangKeluarPageModule {}
