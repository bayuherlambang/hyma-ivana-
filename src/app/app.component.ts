import { Component } from '@angular/core';

import { Platform, ModalController, NavController  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashscreenPage } from './splashscreen/splashscreen.page';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
//import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  dataReturned:any;
  constructor(
    private navCtrl: NavController,
    public storage : Storage,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private router : Router,
    //private fcm: FCM,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.platform.backButton.subscribeWithPriority(9999, () => {
          document.addEventListener('backbutton', function (event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('hello');
          }, false);
      });
      this.statusBar.styleDefault();
      setTimeout(()=>{
          this.splashScreen.hide();
        },0);
      this.openSplash();
      this.storage.get('isLogged').then((val) => {
        //console.log('Your age is', val);
        if(val == 1){
          this.storage.get('isAdmin').then((admin) => {
            if(admin == 1){
              this.navAdminTabs();
            }
            else
            {
              this.navUserTabs();
            }
          });
        }else{
          this.navCtrl.navigateForward('');
        }
      });



      // this.fcm.subscribeToTopic('all');
      // this.fcm.getToken().then(token=>{
      //     console.log(token);
      // })
      // this.fcm.onNotification().subscribe(data=>{
      //   if(data.wasTapped){
      //     console.log("Received in background");
      //   } else {
      //     console.log("Received in foreground");
      //   };
      // })
      // this.fcm.onTokenRefresh().subscribe(token=>{
      //   console.log(token);
      // });
      //end notifications.
       this.statusBar.styleDefault();
       this.splashScreen.hide();
    });

    // if(window.MobileAccessibility){
    //    window.MobileAccessibility.usePreferredTextZoom(false);
    // }
  }
  async openSplash(){
    const splash = await this.modalCtrl.create({
      component: SplashscreenPage,
      componentProps: {
      }
    });
    splash.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {
          this.dataReturned = dataReturned.data;
          //alert('Modal Sent Data :'+ dataReturned);
        }
    });
      return await splash.present();
  }
  navAdminTabs(){
      this.router.navigateByUrl("tab-admin/dashboard-admin");
  }
  navUserTabs(){
      this.router.navigateByUrl("tab-user/dashboard-user");
  }
}
