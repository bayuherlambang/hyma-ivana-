import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderPreparePage } from './order-prepare.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPreparePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderPreparePageRoutingModule {}
