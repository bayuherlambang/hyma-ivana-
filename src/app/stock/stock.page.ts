import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { StockManagementService } from '../services/stock-management.service';
import { StockAddPage } from '../stock-add/stock-add.page';
import { StockShowPage } from '../stock-show/stock-show.page';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { LoadingController } from '@ionic/angular';
import { RouterModule, Routes, Router } from "@angular/router";
import { AuthenticateService } from '../services/authenticate.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

//import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.page.html',
  styleUrls: ['./stock.page.scss'],
})


export class StockPage implements OnInit {
	dataReturned:any;
	title : any;
	public stocks: Array<any>;
  public loadedstocks: Array<any>;
	detailBarang : string;
	jenisBarang : string;
	kondisiBarang : string;
	namaBarang : string;
	ownerBarang : string;
	serialNumber : string;
	statusBarang : string;
	isEdit : boolean;
	loaderToShow: any;
  jenisBarangOption: Array<any>;
  selectedJenisBarang: any;
  isAdmin : boolean;
  scannedBarCode : any;
  selectedtab: any;
  searchQuery = '';
  	constructor(
      private authService: AuthenticateService,
  		public modalController: ModalController,
      private barcodeScanner: BarcodeScanner,
  		private stockManagement : StockManagementService,
  		public loadingController: LoadingController,
  		private router: Router,
      public alertController: AlertController
  	) {
      this.selectedJenisBarang = "all";
    }

  	ngOnInit() {
  		this.showLoader();
      this.authService.isAdmin()
          .then((res) =>{
            if(res){
              this.isAdmin = true;
              this.title = "Manajemen Stok";
            }else{
              this.isAdmin = false;
              this.title = "Daftar Stok";
            }
        	})
          .catch(function (err) {
            console.log("ERROR:"+ err);
      });
  		this.stockManagement.readStock().subscribe(data => {
  	      this.stocks = data.map(e => {
  	        return {
  	          id: e.payload.doc.id,
  	          serialNumber: e.payload.doc.data()['serialNumber'],
  	          namaBarang: e.payload.doc.data()['namaBarang'],
  	          detailBarang: e.payload.doc.data()['detailBarang'],
  	          jenisBarang: e.payload.doc.data()['jenisBarang'],
  	          kondisiBarang : e.payload.doc.data()['kondisiBarang'],
  	          statusBarang: e.payload.doc.data()['statusBarang'],
  	          ownerBarang: e.payload.doc.data()['ownerBarang'],

              createdAt: e.payload.doc.data()['createdAt'],
              createdBy: e.payload.doc.data()['createdBy'],
              updatedAt: this.timeConverter(e.payload.doc.data()['updatedAt']),
              updatedBy: e.payload.doc.data()['updatedBy'],
  	        };
  	      })
          this.loadedstocks = this.stocks;
          this.hideLoader();
          //console.log(this.stocks);
          });
          this.stockManagement.readJenisBarang().get()
    	   		.then(snapshot => {
    	   			this.jenisBarangOption = [];
    	   			snapshot.forEach(e=> {
                this.stockManagement.getDataBarang(e.data()['jenisBarang']).get().then(snapshot => {
          	      let jml = snapshot.size;
          	      this.jenisBarangOption.push(e.data()['jenisBarang']);
                  });
    	   			});
                //console.log(this.jenisBarang);
    	        	return this.jenisBarangOption;
            });
    	}
    async openEditStockModal(item){
    		//console.log(item);
    		const modal = await this.modalController.create({
        		component: StockAddPage,
        		componentProps: {
          		"paramTitle": "Edit Barang",
          		"isEdit" : true,
          		"dataEdit" : item
        		}
      	});

      	modal.onDidDismiss().then((dataReturned) => {
        		if (dataReturned !== null) {
          		this.dataReturned = dataReturned.data;
          		//alert('Modal Sent Data :'+ dataReturned);
        		}
      	});
      	return await modal.present();
    	}
    async openAddStockModal() {
      	const modal = await this.modalController.create({
        		component: StockAddPage,
        		componentProps: {
          		"paramTitle": "Tambah Barang",
          		"isEdit" : false
        		}
      	});

      	modal.onDidDismiss().then((dataReturned) => {
        		if (dataReturned !== null) {
          		this.dataReturned = dataReturned.data;
          		//alert('Modal Sent Data :'+ dataReturned);
        		}
      	});

      	return await modal.present();
    }
    async openStockShowModal(stock) {
      	const modal = await this.modalController.create({
        		component: StockShowPage,
        		componentProps: {
          		"paramTitle": "Detail Barang",
              "stockData" : stock,
        		}
      	});

      	modal.onDidDismiss().then((dataReturned) => {
        		if (dataReturned !== null) {
          		this.dataReturned = dataReturned.data;
          		//alert('Modal Sent Data :'+ dataReturned);
        		}
      	});

      	return await modal.present();
    }
    async deleteStock(rowID) {
      const alert = await this.alertController.create({
          header: 'Konfirmasi!',
          message: 'Hapus barang?',
          buttons: [{
              text: 'Batal',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {
                //console.log('Confirm Cancel: blah');
              }
          }, {
              text: 'Ya',
                handler: () => {
                  //console.log('Confirm Okay');
                  this.stockManagement.deleteStock(rowID);
              }
            }
          ]
      });
      await alert.present();
    }

    showLoader() {
      this.loaderToShow = this.loadingController.create({
        message: 'Memuat data..'
      }).then((res) => {
        res.present();

        res.onDidDismiss().then((dis) => {
          //console.log('Loading dismissed!');
        });
      });
      this.hideLoader();
    }

    hideLoader() {
      	setTimeout(() => {
        		this.loadingController.dismiss();
      	}, 10);
    }
    navAdminTabs(){
      this.router.navigateByUrl("tab-admin/dashboard-admin");
  	 }
    segmentChanged(ev: any) {
      this.searchQuery = "";
          //console.log('Segment changed', ev.target.value);
          if(ev.target.value == "all"){
            this.showLoader();
        		this.stockManagement.readStock().subscribe(data => {
        	      this.stocks = data.map(e => {
        	        return {
        	          id: e.payload.doc.id,
        	          serialNumber: e.payload.doc.data()['serialNumber'],
        	          namaBarang: e.payload.doc.data()['namaBarang'],
        	          detailBarang: e.payload.doc.data()['detailBarang'],
        	          jenisBarang: e.payload.doc.data()['jenisBarang'],
        	          kondisiBarang : e.payload.doc.data()['kondisiBarang'],
        	          statusBarang: e.payload.doc.data()['statusBarang'],
        	          ownerBarang: e.payload.doc.data()['ownerBarang'],

                    createdAt: this.timeConverter(e.payload.doc.data()['createdAt']),
        	          createdBy: e.payload.doc.data()['createdBy'],
        	          updatedAt: this.timeConverter(e.payload.doc.data()['updatedAt']),
        	          updatedBy: e.payload.doc.data()['updatedBy'],

        	        };
        	      })
                this.hideLoader();
              });
          }else{
            this.showLoader();
            this.selectedtab = ev.target.value;
        		this.stockManagement.getDataBarangByJenisBarang(ev.target.value).subscribe(data => {
        	      this.stocks = data.map(e => {
        	        return {
        	          id: e.payload.doc.id,
        	          serialNumber: e.payload.doc.data()['serialNumber'],
        	          namaBarang: e.payload.doc.data()['namaBarang'],
        	          detailBarang: e.payload.doc.data()['detailBarang'],
        	          jenisBarang: e.payload.doc.data()['jenisBarang'],
        	          kondisiBarang : e.payload.doc.data()['kondisiBarang'],
        	          statusBarang: e.payload.doc.data()['statusBarang'],
        	          ownerBarang: e.payload.doc.data()['ownerBarang'],

                    createdAt: this.timeConverter(e.payload.doc.data()['createdAt']),
        	          createdBy: e.payload.doc.data()['createdBy'],
        	          updatedAt: this.timeConverter(e.payload.doc.data()['updatedAt']),
        	          updatedBy: e.payload.doc.data()['updatedBy'],

        	        };
        	      })
                this.hideLoader();
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
    initializeItems(): void {
        this.stocks = this.loadedstocks;
    }
    filterList($evt) {
      this.initializeItems();
      this.showLoader();
      const searchTerm = $evt.target.value;
      //console.log(searchTerm);
      if (!searchTerm) {
        return;
      }

        this.stocks = this.stocks.filter(search => {
          if ((search.serialNumber && searchTerm) || (search.ownerBarang && searchTerm)) {
            if (
                  (
                    (search.serialNumber.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
                      ||
                    (search.ownerBarang.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)
                  ) 
                    &&
                  (search.jenisBarang.toLowerCase().indexOf(this.selectedtab.toLowerCase()) > -1)
                ){
              return true;
              console.log(true);
            }
            return false;
          }

        });

        console.log(this.stocks.length)
      }
    doRefresh(event){
        //console.log('Begin async operation');
        this.selectedJenisBarang = "all";
        this.ngOnInit();
        setTimeout(() => {
          //console.log('Async operation has ended');
          event.target.complete();
        }, 0);
    }
    timeConverter(UNIX_timestamp){
      if(!UNIX_timestamp){
        let a = new Date(UNIX_timestamp * 1000);
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        let year = a.getFullYear();
        let month = months[a.getMonth()];
        let date = a.getDate();
        let hour = a.getHours();
        let min = a.getMinutes();
        let sec = a.getSeconds();
        let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
        return time;
      }
    }

}
