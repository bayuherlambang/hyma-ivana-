import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StockManagementService } from '../services/stock-management.service';
import { AuthenticateService } from '../services/authenticate.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { OrderManagementService } from '../services/order-management.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-validasiheadset',
  templateUrl: './validasiheadset.page.html',
  styleUrls: ['./validasiheadset.page.scss'],
})
export class ValidasiheadsetPage implements OnInit {
	cekForm: FormGroup;
	title : string;
	headset : any;
	public stocks : any;
	test : any = [];
	status = '';
	scannedBarCode : any;
  loaderToShow : any;
  constructor(
  		private stockManagement : StockManagementService,
  		private barcodeScanner: BarcodeScanner,
  		private orderManagement : OrderManagementService,
  		private authService: AuthenticateService,
  		private fb: FormBuilder,
      private loadingController : LoadingController
  	) {
  		this.cekForm = fb.group({
    		serialNumber: ['', Validators.compose([Validators.required])],
		});
  }

  ngOnInit() {

  }
  	scanBarCode() {
	    this.barcodeScanner.scan().then(barcodeData => {
	        this.scannedBarCode = barcodeData.text;
	    }, (err) => {
	        console.log('Error: ', err);
	    });
	}
  onSubmit(){
    //this.showLoader("Memuat data");
  		let data = this.cekForm.value['serialNumber'];
  		this.stockManagement.getIDStock(data).subscribe(data => {
			this.headset = data.map(e => {
			return {
	           	serialNumber: e.payload.doc.data()['serialNumber'],
	           	namaBarang: e.payload.doc.data()['namaBarang'],
		        kondisiBarang : e.payload.doc.data()['kondisiBarang'],
		        statusBarang: e.payload.doc.data()['statusBarang'],
		        ownerBarang: e.payload.doc.data()['ownerBarang'],
				};
			})
		})
    //this.hideLoader();
  }
  reset(){
  	return this.headset = [];
  }



	checkStatus($event) {
		let q = $event.target.value;
		if (q.trim() == '') {
			this.status = 'Masukan SN Headset';
		}
		else {
			this.status = 'Checking.. !!';
			this.stockManagement.getIDStock(q).subscribe(data => {
				this.stocks = data.map(e => {
					return {
						jenisBarang: e.payload.doc.data()['jenisBarang'],
					};
				})
				if(this.stocks[0]['jenisBarang'] == "Headset"){
					this.status = 'Barang ditemukan';
				}else{
					this.status = 'SN bukan headset!';
				}
			});
		}
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
    //this.hideLoader();
  }

  hideLoader() {
    setTimeout(() => {
        this.loadingController.dismiss();
    }, 100);
  }

}
