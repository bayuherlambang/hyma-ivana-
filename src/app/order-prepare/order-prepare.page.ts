import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { StockManagementService } from '../services/stock-management.service';
import { OrderManagementService } from '../services/order-management.service';
import { AuthenticateService } from '../services/authenticate.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { LoadingController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-order-prepare',
  templateUrl: './order-prepare.page.html',
  styleUrls: ['./order-prepare.page.scss'],
})
export class OrderPreparePage implements OnInit {

	title : string;
	dataOrder : any;
	listRequest: Array<any>;
	formListBarang : FormGroup;
  private count: number = 1;
  tempArray : Array<any>;
  userEmail: any;
  loaderToShow : any;
  public sumbitDisabled: boolean = false;
  status = '';
  scannedBarCode : any;
  statusField : any;
  scanresult : any;

  	constructor(
      public storage : Storage,
      private navCtrl: NavController,
      private barcodeScanner: BarcodeScanner,
  		private modalController: ModalController,
  		private stockManagement : StockManagementService,
  		private orderManagement : OrderManagementService,
  		private authService: AuthenticateService,
  		private navParams: NavParams,
  		private fb: FormBuilder,
      public loadingController: LoadingController
  	) {
      this.userEmail = this.authService.userDetails().email.split("@");
      this.userEmail = this.userEmail[0];
   		this.formListBarang = fb.group({
      		jenisBarang: this.fb.array([]) ,
    	})
  	}
  	ngOnInit() {
  		this.title = this.navParams.data.paramTitle;
  		this.dataOrder = this.navParams.data.dataOrder;
      this.sumbitDisabled = false;

  		this.listRequest = this.navParams.data.listRequest;
      this.statusField = new Array(this.listRequest.length);
      this.scannedBarCode = new Array(this.listRequest.length);
  		for(let i=0; i<this.listRequest.length; i++){
  			this.addJenisBarang(this.listRequest[i]['jenisBarang']);
        //this.scannedBarCode.push(i);
        this.statusField[i] = new Array(this.listRequest[i]['jumlahBarang']);
        this.scannedBarCode[i] = new Array(this.listRequest[i]['jumlahBarang']);
  			for(let j=0; j<this.listRequest[i]['jumlahBarang']; j++){
  				this.addBarang(i);
          //this.scannedBarCode[i].push(j);
  			}
  		}
      //console.log(this.scannedBarCode)
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

  	newBarang(): FormGroup {
    	return this.fb.group({
      		serialNumber: ['',Validators.compose([Validators.required])],
    	})
  	}

  	addBarang(jenisIndex:number) {
    	this.listBarang(jenisIndex).push(this.newBarang());
  	}

  	removeBarang(jenisIndex:number,barangIndex:number) {
    	this.listBarang(jenisIndex).removeAt(barangIndex);
  	}

  	onSubmit(id) {
      this.showLoader('Mengirim data');
  		let listBarang = {};
    	let record = this.formListBarang.value['jenisBarang'];
    	//console.log(record);
    	for(let i=0; i<record.length; i++){
      		for(let j=0; j<record[i]['daftarBarang'].length; j++){
            listBarang['jenisBarang'] = record[i]['namaBarang'];
            listBarang['serialNumber'] = record[i]['daftarBarang'][j]['serialNumber'];
      			this.orderManagement.addListBarang(id, listBarang).then(resp => {
      			})
            this.ubahStatusBarang(listBarang['serialNumber'], 'Dipinjam');
            this.addLog(listBarang['serialNumber'], 'Dipinjam');
      		}
    	}

      let updateStatusPinjam = {};
      updateStatusPinjam['status'] = 'Barang Siap';
      updateStatusPinjam['adminPinjam'] = this.userEmail;
      updateStatusPinjam['lastModified'] = Math.floor(new Date().getTime()/1000.0);
      this.orderManagement.updateOrder(id,updateStatusPinjam);
      let dataLog = {};
      dataLog['status'] = "Barang Siap";
      dataLog['user'] = this.userEmail;
      dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
      this.orderManagement.addLogOrder(id,dataLog);
      this.hideLoader();
    	this.closeModal(close);
      //this.navCtrl.navigateForward('/order');
  	 }

     ubahStatusBarang(sn, status){
       this.stockManagement.getIDBarang(sn).get()
         .then(snapshot => {
           let stock = [];
           snapshot.forEach(e=> {
             stock.push(e.id);
           });
           let id=stock[0];
           //console.log(id);
           let dataUpdate = {};
           dataUpdate['statusBarang'] = status;
           this.stockManagement.updateStock(id, dataUpdate);
         	//this.stockManagement.setStockStatus(id, status);
       });
   	 }
    addLog(sn, status){
      this.stockManagement.getIDBarang(sn).get()
        .then(snapshot => {
          this.tempArray = [];
          snapshot.forEach(e=> {
            this.tempArray.push(e.id);
          });
          let id = this.tempArray[0];
          //console.log(id);
          let dataLog = {};
          dataLog['status'] = status;
          dataLog['user'] = this.dataOrder['namaPeminjam'];
          dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
          this.stockManagement.addLogUser(id,dataLog);

      });
    }

  	checkStatus($event, jenisIndex, barangIndex) {
      let q = $event.target.value;
      let stocks;
      let namaJenis = this.jenisBarang().at(jenisIndex).get('namaBarang').value;
      if (q.trim() == '') {
        this.statusField[jenisIndex][barangIndex] = 'Masukan SN barang';
        //this.sumbitDisabled = true;
      }
      else {
        //console.log(this.jenisBarang());
        this.status = 'Checking.. !!';
        this.stockManagement.getIDBarang(q).get()
          .then(snapshot => {
            stocks = [];
            snapshot.forEach(e=> {
              stocks.push(e.data());
            });
            if(stocks[0]){
              if(stocks[0]['statusBarang'] != "Available" || stocks[0]['jenisBarang'] != namaJenis){
                if(stocks[0]['statusBarang'] != "Available"){
                  this.statusField[jenisIndex][barangIndex] = 'Stock barang tidak tersedia!';
                  //this.sumbitDisabled = true;
                }else if(stocks[0]['jenisBarang'] != namaJenis){
                this.statusField[jenisIndex][barangIndex] = 'Jenis barang tidak sesuai';
                //this.sumbitDisabled = true;
                }
              }else{
                this.statusField[jenisIndex][barangIndex] = 'Barang Tersedia';
                //this.sumbitDisabled = false;
              }
            }
          });
        /*
        this.stockManagement.getIDStock(q).subscribe(data => {
          stocks = data.map(e => {
            return {
              statusBarang: e.payload.doc.data()['statusBarang'],
              jenisBarang: e.payload.doc.data()['jenisBarang'],
            };
          })
          if(stocks[0]['statusBarang'] != "Available" || stocks[0]['jenisBarang'] != namaJenis){
            if(stocks[0]['statusBarang'] != "Available"){
              this.statusField[jenisIndex][barangIndex] = 'Stock barang tidak tersedia!';
              //this.sumbitDisabled = true;
            }else if(stocks[0]['jenisBarang'] != namaJenis){
            this.statusField[jenisIndex][barangIndex] = 'Jenis barang tidak sesuai';
            //this.sumbitDisabled = true;
            }
          }else{
            this.statusField[jenisIndex][barangIndex] = 'Barang Tersedia';
            //this.sumbitDisabled = false;
          }
        });
        */
      }
    }

  	async closeModal(param) {
      await this.modalController.dismiss(param);
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

    scanBarCode(jenisIndex, barangIndex) {
      this.barcodeScanner.scan().then(barcodeData => {
          this.scannedBarCode[jenisIndex][barangIndex] = barcodeData.text;
      }, (err) => {
          console.log('Error: ', err);
      });
    }
}
