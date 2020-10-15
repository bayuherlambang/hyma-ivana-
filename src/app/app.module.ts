import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from 'src/environments/environment';
import { AuthenticateService } from './services/authenticate.service';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
//import { AngularFireModule } from "@angular/fire";
import { StockAddPageModule } from './stock-add/stock-add.module';
import { StockShowPageModule } from './stock-show/stock-show.module';
import { OrderFormPageModule } from './order-form/order-form.module';
import { OrderShowPageModule } from './order-show/order-show.module';
import { OrderPreparePageModule } from './order-prepare/order-prepare.module';
import { OrderCheckPageModule } from './order-check/order-check.module'
import { BarangMasukPageModule } from './barang-masuk/barang-masuk.module';
import { BarangKeluarPageModule } from './barang-keluar/barang-keluar.module';
import { ImportfilePageModule } from './importfile/importfile.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as firebase from 'firebase';
import { SplashscreenPage } from './splashscreen/splashscreen.page';
import {HttpClientModule} from '@angular/common/http';

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent,SplashscreenPage],
  entryComponents: [AppComponent,SplashscreenPage],
  imports: [BrowserModule,
  			IonicModule.forRoot({hardwareBackButton: false}),
        IonicStorageModule.forRoot(),
  			AppRoutingModule,
  			AngularFireModule.initializeApp(environment.firebase),
  			AngularFireAuthModule,
    		AngularFireDatabaseModule,
    		AngularFirestoreModule,
    		StockAddPageModule,
        StockShowPageModule,
    		OrderFormPageModule,
    		OrderShowPageModule,
    		OrderPreparePageModule,
    		OrderCheckPageModule,
    		BarangMasukPageModule,
    		BarangKeluarPageModule,
        ImportfilePageModule,
    		FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        HttpClientModule,
  			],
  providers: [
    StatusBar,
    SplashScreen,
    AuthenticateService,
    BarcodeScanner,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
