import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogPeminjamanPage } from './log-peminjaman.page';

const routes: Routes = [
  {
    path: '',
    component: LogPeminjamanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogPeminjamanPageRoutingModule {}
