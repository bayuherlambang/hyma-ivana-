import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockAddPage } from './stock-add.page';

const routes: Routes = [
  {
    path: '',
    component: StockAddPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockAddPageRoutingModule {}
