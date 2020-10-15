import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { StockManagementService } from '../services/stock-management.service';
import { OrderManagementService } from '../services/order-management.service';
import { AuthenticateService } from '../services/authenticate.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { OrderPreparePage } from '../order-prepare/order-prepare.page';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-order-check',
  templateUrl: './order-check.page.html',
  styleUrls: ['./order-check.page.scss'],
})
export class OrderCheckPage implements OnInit {
  	title : string;
  	dataOrder : any;
  	dataPinjam : any;
  	listRequest: Array<any>;
  	formListBarang : FormGroup;
  	private count: number = 1;
  	tempArray : Array<any>;
  	userEmail: any;
  	loaderToShow : any;

    constructor(
        public storage : Storage,
        private navCtrl: NavController,
    		private modalController: ModalController,
    		private stockManagement : StockManagementService,
    		private orderManagement : OrderManagementService,
    		private authService: AuthenticateService,
    		private navParams: NavParams,
    		private fb: FormBuilder,
      	public loadingController: LoadingController,
      	public alertController: AlertController
    	) {
          this.storage.get('username').then((val) => {
            this.userEmail = val;
          });
          this.formListBarang = fb.group({
        		jenisBarang: this.fb.array([]) ,
          })
     	}

  	ngOnInit() {
  		this.title = this.navParams.data.paramTitle;
  		this.dataOrder = this.navParams.data.dataOrder;
  		console.log(this.dataOrder);
  		this.listRequest = this.navParams.data.listRequest;
  		for(let i=0; i<this.listRequest.length; i++){
  			this.addJenisBarang(this.listRequest[i]['jenisBarang']);
  			for(let j=0; j<this.listRequest[i]['jumlahBarang']; j++){
  				this.addBarang(i, this.listRequest[i]['jenisBarang']);
  			}
  		}
  	}
  	jenisBarang(): FormArray {
    	return this.formListBarang.get("jenisBarang") as FormArray
    }


  	newJenisBarang(brg): FormGroup {
    	return this.fb.group({
      		namaBarang: brg,
      		daftarBarang:this.fb.array([])
    	})
  	}

  	addJenisBarang(brg) {
    	this.jenisBarang().push(this.newJenisBarang(brg));
  	}

  	removeJenisBarang(jenisIndex:number) {
    	this.jenisBarang().removeAt(jenisIndex);
  	}

  	listBarang(jenisIndex:number) : FormArray {
    	return this.jenisBarang().at(jenisIndex).get("daftarBarang") as FormArray
  	}

  	newBarang(brg): FormGroup {
    	return this.fb.group({
      		serialNumber: [''],
    	})
  	}

  	addBarang(jenisIndex:number, brg) {
    	this.listBarang(jenisIndex).push(this.newBarang(brg));
  	}

    removeBarang(jenisIndex:number,barangIndex:number) {
      this.listBarang(jenisIndex).removeAt(barangIndex);
    }

  	onSubmit(id) {
      /*
  		let listBarang = [];
      let listPinjam = [];
  		let serialNumber : string;
      let unmatch = [];
    	let record = this.formListBarang.value['jenisBarang'];

    	this.orderManagement.getListPinjam(id).subscribe(data => {
      		this.dataPinjam = data.map(e => {
      				return {
  	           	//id: e.payload.doc.id,
  	           	serialNumber: e.payload.doc.data()['serialNumber'],
      			};
          })
          //console.log(this.dataPinjam);
          for(let i=0; i<record.length; i++){
            for(let j=0; j<record[i]['daftarBarang'].length; j++){
                listBarang.push(record[i]['daftarBarang'][j]['serialNumber']);
            }
          }
          for(let i=0; i<this.dataPinjam.length; i++){
            let temp : string;
            temp = this.dataPinjam[i].serialNumber;
            if(listBarang.indexOf(temp)!== -1){
              //console.log(temp+" ada");
            }else{
              this.showAlert("Error", "Barang dengan SN "+temp+" tidak ada");
              this.pushArray(temp, unmatch);
            }
          }
        })
      console.log(unmatch.length);

      //order selesai

      const alert = await this.alertController.create({
	      	header: 'Konfirmasi!',
	      	message: 'Apakah barang yang dipinjam sudah dikembalikan dan sesuai dengan jumlah pemesanan?',
	      	buttons: [{
	          	text: 'Batal',
	          	role: 'cancel',
	          	cssClass: 'secondary',
	          	handler: (blah) => {
	            	console.log('Confirm Cancel: blah');
	          	}
	        }, {
	         	text: 'Ya',
	          	handler: () => {
	            	//console.log('Confirm Okay');
	            	this.closeModal();
	            	this.orderManagement.getListPinjam(orderID).subscribe(data => {
						this.dataPinjam = data.map(e => {
	          				this.ubahStatusBarang(e.payload.doc.data()['serialNumber'], 'Available');
						})
					})
					let updateStatusPinjam = {};
				    updateStatusPinjam['status'] = 'Selesai';
				    updateStatusPinjam['adminPinjam'] = this.userEmail;
				    updateStatusPinjam['lastModified'] = new Date().toLocaleString();
				    this.orderManagement.updateOrder(orderID,updateStatusPinjam);
				    this.showAlert();
	        	}
	    	}
	      	]
	    });

	    await alert.present();
	    */
  	 }

     pushArray(val, arr){
      arr.push(val);
     }
  	 async showAlert(header, msg) {
      let alert = await this.alertController.create({
        header: header,
	    message: msg,
      });
      alert.present();
      setTimeout(()=>{
          alert.dismiss();
      }, 1000);
    }

}
