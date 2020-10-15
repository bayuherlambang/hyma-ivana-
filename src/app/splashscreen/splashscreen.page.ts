import { Component, OnInit, Injectable  } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  selector: 'app-splashscreen',
  templateUrl: './splashscreen.page.html',
  styleUrls: ['./splashscreen.page.scss'],
})
//@Injectable()
//@IonicPage()
export class SplashscreenPage implements OnInit {

  constructor(
    public modalCtrl: ModalController,
    //public splashScreen: SplashScreen,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    //this.SplashScreen.hide();
    setTimeout(() => {
      this.modalCtrl.dismiss();
    }, 2500);
  }
  

}
