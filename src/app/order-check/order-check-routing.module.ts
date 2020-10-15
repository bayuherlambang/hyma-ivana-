import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderCheckPage } from './order-check.page';

const routes: Routes = [
  {
    path: '',
    component: OrderCheckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderCheckPageRoutingModule {}
