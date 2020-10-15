import { Component, OnInit } from '@angular/core';

import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthenticateService } from '../services/authenticate.service';
import { RouterModule, Routes, Router } from "@angular/router";
import { LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';

//import { IonicStorageModule } from '@ionic/storage';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	  validations_form: FormGroup;
  	errorMessage: string = '';
  	loaderToShow: any;
    userEmail : any;
  	constructor(
      public storage : Storage,
    	private navCtrl: NavController,
    	private authService: AuthenticateService,
    	private formBuilder: FormBuilder,
    	private router: Router,
    	public loadingController: LoadingController,
      public alertController: AlertController,
    	private routerOutlet: IonRouterOutlet
    ) { }
    ionViewWillEnter() {
      this.routerOutlet.swipeGesture = false;
    }

    ionViewWillLeave() {
      this.routerOutlet.swipeGesture = true;
    }

  	ngOnInit() {
  		this.validations_form = this.formBuilder.group({
      		email: new FormControl('', Validators.compose([
        				Validators.required,
        				Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      				])),
      		password: new FormControl('', Validators.compose([
        				Validators.minLength(5),
        				Validators.required
      				])),
    	});
  	}
  	validation_messages = {
    	'email': [
      		{ type: 'required', message: 'Masukan alamat email.' },
      		{ type: 'pattern', message: 'Masukan alamat email yang valid.' }
    	],
    	'password': [
      		{ type: 'required', message: 'Masukan kata sandi.' },
      		{ type: 'minlength', message: 'Kata sandi minimal 5 karakter.' }
    	]
  	};

  	loginUser(value){
  		this.showLoader();
    	this.authService.loginUser(value)
    	.then(res => {
      		this.authService.isAdmin()
      		.then((res) =>{
      			if(res){
      		 		this.hideLoader();
              this.storage.set('isLogged', 1);
              this.storage.set('isAdmin', 1);
              this.userEmail = this.authService.userDetails().email.split("@");
          		this.userEmail = this.userEmail[0];
              this.storage.set('username', this.userEmail);
      		 		this.navAdminTabs();
      		 	}
      		 	else
      		 	{
      		 		this.hideLoader();
              this.storage.set('isLogged', 1);
              this.storage.set('isAdmin', 0);
              this.userEmail = this.authService.userDetails().email.split("@");
          		this.userEmail = this.userEmail[0];
              this.storage.set('username', this.userEmail);
      		 		this.navUserTabs();
      		 	}
      		})

    		.catch(function (err) {
    			console.log("ERROR:"+ err);
          this.showAlert(err);
    		});
    	}, err => {
    		this.hideLoader();
        this.showAlert(err.message);
      		this.errorMessage = err.message;
    	})
  	}
  goToRegisterPage(){
    	this.navCtrl.navigateForward('/register');
  }
  navAdminTabs(){
    	this.router.navigateByUrl("tab-admin/dashboard-admin");
	}

	navUserTabs(){
    	this.router.navigateByUrl("tab-user/dashboard-user");
	}

	showLoader() {
	    this.loaderToShow = this.loadingController.create({
	      message: 'Memproses login'
	    }).then((res) => {
	      res.present();

	      res.onDidDismiss().then((dis) => {
	        console.log('Loading dismissed!');
	      });
	    });
	    //this.hideLoader();
	}

  hideLoader() {
    	setTimeout(() => {
      		this.loadingController.dismiss();
    	}, 100);
  }
  async showAlert(msg) {
      let alert = await this.alertController.create({
      header: 'Error!',
	    message: msg,
      });
      alert.present();
      setTimeout(()=>{
          alert.dismiss();
      }, 1000);
    }

}
