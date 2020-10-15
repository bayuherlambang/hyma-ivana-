import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabUserPage } from './tab-user.page';


const routes: Routes = [
  {
    path: '',
    component: TabUserPage,
    children: [
      {
        path: 'dashboard-user',
    	loadChildren: () => import('../dashboard-user/dashboard-user.module').then( m => m.DashboardUserPageModule)
      },
      {
        path: 'list-order',
	    loadChildren: () => import('../order/order.module').then( m => m.OrderPageModule)
      }
    ]
  },
  {
    path: 'tab-user',
    redirectTo: '/tab-admin/dashboard-user',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabUserPageRoutingModule {}
