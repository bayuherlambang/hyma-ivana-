import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabAdminPage } from './tab-admin.page';

const routes: Routes = [
  {
    path: '',
    component: TabAdminPage,
    children: [
      {
        path: 'dashboard-admin',
    	loadChildren: () => import('../dashboard-admin/dashboard-admin.module').then( m => m.DashboardAdminPageModule)
    	//loadChildren: () => import('/app/dashboard-admin/dashboard-admin.module').then( m => m.DashboardAdminPageModule)
      },
      {
        path: 'list-order',
	    loadChildren: () => import('../order/order.module').then( m => m.OrderPageModule)
      }
    ]
  },
  {
    path: 'tab-admin',
    redirectTo: '/tab-admin/dashboard-admin',
    pathMatch:'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabAdminPageRoutingModule {}
