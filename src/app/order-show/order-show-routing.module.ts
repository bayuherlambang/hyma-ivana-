import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderShowPage } from './order-show.page';

const routes: Routes = [
  {
    path: '',
    component: OrderShowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderShowPageRoutingModule {}
