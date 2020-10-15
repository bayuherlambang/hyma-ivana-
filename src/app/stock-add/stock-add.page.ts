import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StockManagementService } from '../services/stock-management.service';
import { AuthenticateService } from '../services/authenticate.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-stock-add',
  templateUrl: './stock-add.page.html',
  styleUrls: ['./stock-add.page.scss'],
})
export class StockAddPage implements OnInit {

	stockForm: FormGroup;
	title : string;
	isEdit : boolean;
	selectedValue: any;
	addForm : any;
	editForm : any;
	public item: any;
	public jenisBarang: Array<any>;
	public kondisiBarang: Array<any>;
	public statusBarang: Array<any>;

	idBarang : string;
	detailBarang : string;
	selectedJenisBarang : any;
	selectedKondisiBarang : string;
	namaBarang : string;
	ownerBarang : string;
	serialNumber : string;
	selectedStatusBarang : string;
	scannedBarCode : any;
	userEmail: any;
	loaderToShow : any;
  status : any;
  sumbitDisabled: any = true;
  	constructor(
      public storage : Storage,
  		private modalController: ModalController,
  		public loadingController: LoadingController,
  		private barcodeScanner: BarcodeScanner,
  		private stockManagement : StockManagementService,
  		private authService: AuthenticateService,
  		private navParams: NavParams,
  		private fb: FormBuilder
  	) {
      this.storage.get('username').then((val) => {
        this.userEmail = val;
      });
  		this.addForm = fb.group({
    		serialNumber: ['',Validators.compose([Validators.required])],
    		namaBarang: ['',Validators.compose([Validators.required])],
    		detailBarang: [''],
    		ownerBarang: ['',Validators.compose([Validators.required])],
    		selectedJenisBarang: ['',Validators.compose([Validators.required])],
    		selectedKondisiBarang: ['',Validators.compose([Validators.required])],
    		selectedStatusBarang: ['',Validators.compose([Validators.required])],
		});
  	}

  	ngOnInit() {
  		this.title = this.navParams.data.paramTitle;
  		this.isEdit = this.navParams.data.isEdit;

  		this.stockManagement.readJenisBarang().get()
   		.then(snapshot => {
   			this.jenisBarang = [];
   			snapshot.forEach(e=> {
   				this.jenisBarang.push(e.data());
   			});

        	return this.jenisBarang;
        });
        this.stockManagement.readKondisiBarang().get()
   		.then(snapshot => {
   			this.kondisiBarang = [];
   			snapshot.forEach(e=> {
   				this.kondisiBarang.push(e.data());
   			});
        	return this.kondisiBarang;
        });
        this.stockManagement.readStatusBarang().get()
   		.then(snapshot => {
   			this.statusBarang = [];
   			snapshot.forEach(e=> {
   				this.statusBarang.push(e.data());
   			});
   			//console.log(this.statusBarang);
        	return this.statusBarang;
        });
   		if(this.isEdit){
  			this.item = this.navParams.data.dataEdit;
  			this.idBarang = this.item.id;
  			//console.log(this.item.id);
    			this.editForm = this.fb.group({
    	    		serialNumber: [{value:this.item.serialNumber, disabled: true},Validators.compose([Validators.required])],
    	    		namaBarang: [this.item.namaBarang,],
    	    		detailBarang: [this.item.detailBarang],
    	    		ownerBarang: [this.item.ownerBarang,],
    	    		selectedJenisBarang: [this.item.jenisBarang,Validators.compose([Validators.required])],
    	    		selectedKondisiBarang: [this.item.kondisiBarang,Validators.compose([Validators.required])],
    	    		selectedStatusBarang: [this.item.statusBarang,Validators.compose([Validators.required])],
    			});
		    }

  	}
  	scanBarCode() {
	    this.barcodeScanner.scan().then(barcodeData => {
	        this.scannedBarCode = barcodeData.text;
	    }, (err) => {
	        console.log('Error: ', err);
	    });
	   }
  	addStock() {
  		this.showLoader('Mengirim data');
    	let record = {};
		  record['serialNumber'] = this.addForm.controls["serialNumber"].value;
    	record['namaBarang'] = this.addForm.controls["namaBarang"].value;
    	record['detailBarang'] = this.addForm.controls["detailBarang"].value;
    	record['ownerBarang'] = this.addForm.controls["ownerBarang"].value;
    	record['jenisBarang'] = this.addForm.controls["selectedJenisBarang"].value;
    	record['kondisiBarang'] = this.addForm.controls["selectedKondisiBarang"].value;
    	record['statusBarang'] = this.addForm.controls["selectedStatusBarang"].value;
    	record['createdAt'] = Math.floor(new Date().getTime()/1000.0);
    	record['updatedAt'] = "";
    	record['createdBy'] = this.userEmail;
    	record['updatedBy'] = "";
    	this.stockManagement.addStock(record).then(resp => {
    		this.hideLoader();
    		this.modalController.dismiss();
    	})
      	.catch(error => {
      		this.hideLoader();
        	console.log(error);
      	});
  	}

	UpdateStock(recordRow) {
		this.showLoader('Mengirim data');
	    let record = {};
	    	record['serialNumber'] = this.editForm.controls["serialNumber"].value;
	    	record['namaBarang'] = this.editForm.controls["namaBarang"].value;
	    	record['detailBarang'] = this.editForm.controls["detailBarang"].value;
	    	record['jenisBarang'] = this.editForm.controls["selectedJenisBarang"].value;
	    	record['ownerBarang'] = this.editForm.controls["ownerBarang"].value;
	    	record['kondisiBarang'] = this.editForm.controls["selectedKondisiBarang"].value;
	    	record['statusBarang'] = this.editForm.controls["selectedStatusBarang"].value;
	    	//record['createdAt'] = new Date().toLocaleString();
	    	record['updatedAt'] = Math.floor(new Date().getTime()/1000.0);
	    	//record['createdBy'] = "";
	    	record['updatedBy'] = this.userEmail;
	    	this.stockManagement.updateStock(recordRow.id, record);
	    	this.hideLoader();
	    	this.modalController.dismiss();
	}
  	async closeModal() {
    //const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss();
  	}

  	getSelectedOption(data) {
   	this.selectedValue = data;
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
    checkStatus($event) {
      let q = $event.target.value;
      let stocks;
      if (q.trim() == '') {
        this.status = 'Masukan SN barang';
        //this.sumbitDisabled = true;
      }
      else {
        this.status = 'Checking.. !!';
        this.stockManagement.getIDStock(q).subscribe(data => {
          stocks = data.map(e => {
            return {
               serialNumber: e.payload.doc.data()['serialNumber']
            };
          })
          if(stocks.length>0){
            if(stocks[0]['serialNumber'] == q){
              this.status = 'Barang sudah terdaftar';
              this.sumbitDisabled = true;
            }
          }else{
              this.status = 'Barang belum terdaftar';
              this.sumbitDisabled = false;
            }
        });
      }
    }
}
