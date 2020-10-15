import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './login/login.module#LoginPageModule' },
  //{ path: 'dashboard-admin', loadChildren: './dashboard-admin/dashboard-admin.module#DashboardAdminPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  {
    path: 'dashboard-user',
    loadChildren: () => import('./dashboard-user/dashboard-user.module').then( m => m.DashboardUserPageModule)
  },
  {
    path: 'dashboard-admin',
    loadChildren: () => import('./dashboard-admin/dashboard-admin.module').then( m => m.DashboardAdminPageModule)
  },
  {
    path: 'stock',
    loadChildren: () => import('./stock/stock.module').then( m => m.StockPageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'list-order',
    loadChildren: () => import('./list-order/list-order.module').then( m => m.ListOrderPageModule)
  },
  {
    path: 'tab-user',
    loadChildren: () => import('./tab-user/tab-user.module').then( m => m.TabUserPageModule)
  },
  {
    path: 'tab-admin',
    loadChildren: () => import('./tab-admin/tab-admin.module').then( m => m.TabAdminPageModule)
  },
  {
    path: 'stock-add',
    loadChildren: () => import('./stock-add/stock-add.module').then( m => m.StockAddPageModule)
  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then( m => m.OrderPageModule)
  },
  {
    path: 'order-form',
    loadChildren: () => import('./order-form/order-form.module').then( m => m.OrderFormPageModule)
  },
  {
    path: 'order-show',
    loadChildren: () => import('./order-show/order-show.module').then( m => m.OrderShowPageModule)
  },
  {
    path: 'order-prepare',
    loadChildren: () => import('./order-prepare/order-prepare.module').then( m => m.OrderPreparePageModule)
  },
  {
    path: 'order-check',
    loadChildren: () => import('./order-check/order-check.module').then( m => m.OrderCheckPageModule)
  },
  {
    path: 'log-peminjaman',
    loadChildren: () => import('./log-peminjaman/log-peminjaman.module').then( m => m.LogPeminjamanPageModule)
  },
  {
    path: 'validasiheadset',
    loadChildren: () => import('./validasiheadset/validasiheadset.module').then( m => m.ValidasiheadsetPageModule)
  },
  {
    path: 'stock-opname',
    loadChildren: () => import('./stock-opname/stock-opname.module').then( m => m.StockOpnamePageModule)
  },
  {
    path: 'barang-masuk',
    loadChildren: () => import('./barang-masuk/barang-masuk.module').then( m => m.BarangMasukPageModule)
  },
  {
    path: 'barang-keluar',
    loadChildren: () => import('./barang-keluar/barang-keluar.module').then( m => m.BarangKeluarPageModule)
  },
  {
    path: 'splashscreen',
    loadChildren: () => import('./splashscreen/splashscreen.module').then( m => m.SplashscreenPageModule)
  },
  {
    path: 'stock-show',
    loadChildren: () => import('./stock-show/stock-show.module').then( m => m.StockShowPageModule)
  },
  {
    path: 'importfile',
    loadChildren: () => import('./importfile/importfile.module').then( m => m.ImportfilePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
