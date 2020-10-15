import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImportfilePage } from './importfile.page';

const routes: Routes = [
  {
    path: '',
    component: ImportfilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImportfilePageRoutingModule {}
