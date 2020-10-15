import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthenticateService } from '../services/authenticate.service';
import { NavController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
	validations_form: FormGroup;
  	errorMessage: string = '';
  	successMessage: string = '';
    loaderToShow:any;

  	validation_messages = {
   		'email': [
     		{ type: 'required', message: 'Email is required.' },
     		{ type: 'pattern', message: 'Enter a valid email.' }
   		],
   		'password': [
     		{ type: 'required', message: 'Password is required.' },
     		{ type: 'minlength', message: 'Password must be at least 5 characters long.' }
   		]
 	};
  	constructor(
    	private navCtrl: NavController,
    	private authService: AuthenticateService,
    	private formBuilder: FormBuilder,
      public loadingController: LoadingController,
      private routerOutlet: IonRouterOutlet
  	) {}
    ionViewWillEnter() {
      this.routerOutlet.swipeGesture = false;
    }

    ionViewWillLeave() {
      this.routerOutlet.swipeGesture = true;
    }

  ngOnInit() {
  	this.validations_form = this.formBuilder.group({
  		fname: new FormControl('', Validators.compose([
        //Validators.minLength(5),
        Validators.required
      ])),
  		lname: new FormControl('', Validators.compose([
        // /Validators.minLength(5),
        Validators.required
      ])),
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
  tryRegister(value){
    this.showLoader("Mengirim data");
    this.authService.registerUser(value)
     .then(res => {
       console.log(res);
       this.hideLoader();
       this.errorMessage = "";
       this.successMessage = "Your account has been created. Please log in.";
     }, err => {
       console.log(err);
       this.hideLoader();
       this.errorMessage = err.message;
       this.successMessage = "";
     })
  }
  goLoginPage(){
    this.navCtrl.navigateBack('');
  }
  showLoader(msg) {
    this.loaderToShow = this.loadingController.create({
      message: msg
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed!');
      });
    });
    this.hideLoader();
  }
  hideLoader() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 0);
  }

}
