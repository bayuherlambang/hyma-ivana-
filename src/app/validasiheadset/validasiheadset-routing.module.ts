import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidasiheadsetPage } from './validasiheadset.page';

const routes: Routes = [
  {
    path: '',
    component: ValidasiheadsetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidasiheadsetPageRoutingModule {}
