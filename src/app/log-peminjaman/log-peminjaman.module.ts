import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule,Validators, FormControl } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogPeminjamanPageRoutingModule } from './log-peminjaman-routing.module';

import { LogPeminjamanPage } from './log-peminjaman.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    LogPeminjamanPageRoutingModule
  ],
  declarations: [LogPeminjamanPage]
})
export class LogPeminjamanPageModule {}
