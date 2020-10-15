import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockShowPage } from './stock-show.page';

const routes: Routes = [
  {
    path: '',
    component: StockShowPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockShowPageRoutingModule {}
