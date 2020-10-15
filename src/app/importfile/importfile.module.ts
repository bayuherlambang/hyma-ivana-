import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ImportfilePageRoutingModule } from './importfile-routing.module';

import { ImportfilePage } from './importfile.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ImportfilePageRoutingModule
  ],
  declarations: [ImportfilePage]
})
export class ImportfilePageModule {}
