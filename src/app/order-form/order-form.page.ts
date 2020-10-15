import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { StockManagementService } from '../services/stock-management.service';
import { OrderManagementService } from '../services/order-management.service';
import { AuthenticateService } from '../services/authenticate.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http/';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.page.html',
  styleUrls: ['./order-form.page.scss'],
})
export class OrderFormPage implements OnInit {
  	title : string;
  	formDataPinjam : FormGroup;
  	public dataJenisBarang: Array<any>;
  	private count: number = 1;
  	loaderToShow: any;
    email:any;
  	userEmail: string;

  	constructor(
      public storage : Storage,
  		private modalController: ModalController,
  		private stockManagement : StockManagementService,
  		private orderManagement : OrderManagementService,
  	   private authService: AuthenticateService,
  		private navParams: NavParams,
  		private fb: FormBuilder,
  		public loadingController: LoadingController,
      private http: HttpClient,

  		) {
        this.email = this.authService.userDetails().email.split("@");
        this.userEmail = this.email[0];

  		this.stockManagement.readJenisBarang().get()
   		.then(snapshot => {
   			this.dataJenisBarang = [];
   			snapshot.forEach(e=> {
   				this.dataJenisBarang.push(e.data());
   			});
   			//console.log(this.jenisBarang);
        	return this.dataJenisBarang;
        });

  		    this.formDataPinjam = fb.group({
        		listRequest: this.fb.array([]) ,
    	     })

    	this.addListRequest();
  	}

  	ngOnInit() {
  		this.title = this.navParams.data.paramTitle;
      console.log(this.userEmail)
  	}

  	listRequest(): FormArray {
    	return this.formDataPinjam.get("listRequest") as FormArray
	   }


  	newListRequest(): FormGroup {
    	return this.fb.group({
      		jenisBarang: ['',Validators.compose([Validators.required])],
      		jumlahBarang: ['',Validators.compose([Validators.required])]
    	})
  	}


  	addListRequest() {
    	this.listRequest().push(this.newListRequest());
  	}

  	removeListRequest(listIndex:number) {
    	this.listRequest().removeAt(listIndex);
  	}

  	onSubmit() {
  		//console.log(this.formDataPinjam.value);
  		let dataOrder = {};
      //this.userEmail = this.authService.userDetails().email.split("@");
      dataOrder['status'] = "Logged";
  		dataOrder['namaPeminjam'] = this.userEmail;
  		dataOrder['createdAt'] = Math.floor(new Date().getTime()/1000.0);

  		let dataList = this.formDataPinjam.value['listRequest'];
      //sconsole.log(dataList);
  		this.showLoader("Mengirim data");
	    this.orderManagement.addOrder(dataOrder).then(resp => {
		       for(let i=0; i<dataList.length; i++){
      				let list = {};
      				list['jenisBarang'] = dataList[i]['jenisBarang'];
      				list['jumlahBarang'] = dataList[i]['jumlahBarang'];
				      //console.log(list);
				      this.orderManagement.addListRequest(resp.id, list).then(resp => {
				      })
              let dataLog = {};
              dataLog['status'] = "Logged";
              dataLog['user'] = dataOrder['namaPeminjam'];
              dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
              this.orderManagement.addLogOrder(resp.id,dataLog);
		        }
		  })
      let body = "Peminjaman baru dari "+this.userEmail+".";
      this.sendNotification("Peminjaman Baru", body);
      this.closeModal();
  	}

    async closeModal() {
    	await this.modalController.dismiss();
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
    	}, 100);
  	}
    sendNotification(header, message)
    {
    let body = {
        "notification":{
          "title":header,
          "body":message,
          "sound":"default",
          "click_action":"FCM_PLUGIN_ACTIVITY",
          "icon":"fcm_push_icon"
        },
        "data":{
          "param1":"value1",
          "param2":"value2"
        },
          "to":"/topics/all",
          "priority":"high",
          "restricted_package_name":""
      }
      let options = new HttpHeaders().set('Content-Type','application/json');
      this.http.post("https://fcm.googleapis.com/fcm/send",body,{
        headers: options.set('Authorization', 'key=AIzaSyARDRSHZPAG5JCv_svDGOyrAtqrZpOfvPQ'),
      })
        .subscribe();
    }

}
