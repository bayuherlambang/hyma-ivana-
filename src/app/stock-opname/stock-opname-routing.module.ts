import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockOpnamePage } from './stock-opname.page';

const routes: Routes = [
  {
    path: '',
    component: StockOpnamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockOpnamePageRoutingModule {}
