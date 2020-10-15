import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StockManagementService } from '../services/stock-management.service';
import { OrderManagementService } from '../services/order-management.service';
import { AuthenticateService } from '../services/authenticate.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { OrderPreparePage } from '../order-prepare/order-prepare.page';
import { AlertController } from '@ionic/angular';
import { OrderCheckPage } from '../order-check/order-check.page';
import { Storage } from '@ionic/storage';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-order-show',
  templateUrl: './order-show.page.html',
  styleUrls: ['./order-show.page.scss'],
})
export class OrderShowPage implements OnInit {
  loaderToShow : any;
	dataReturned : any;
	title : string;
	isAdmin : any;
  isAdminStock : any;
  role : any;
	dataOrder : any;
	dataPinjam : any;
	dataBarang : any;
	listRequest: Array<any>;
	tempArray: any;
	userEmail : any;
  logStatus : any;
  //tempArray: any;

  	constructor(
      public storage : Storage,
      public loadingController: LoadingController,
  		private modalController: ModalController,
  		private stockManagement : StockManagementService,
  		private orderManagement : OrderManagementService,
  		private authService: AuthenticateService,
  		private navParams: NavParams,
  		public alertController: AlertController
  	) {
      this.userEmail = this.authService.userDetails().email.split("@");
      this.userEmail = this.userEmail[0];
  	}

  	ngOnInit() {
  		this.title = this.navParams.data.paramTitle;
  		this.dataOrder = this.navParams.data.dataOrder;
  		this.isAdmin = this.navParams.data.isAdmin;
      //this.isAdminStock = this.navParams.data.isAdminStock;
      this.role = this.navParams.data.role;
  		this.orderManagement.readListRequest(this.dataOrder.id).subscribe(data => {
			this.listRequest = data.map(e => {
			return {
	           	id: e.payload.doc.id,
				jenisBarang: e.payload.doc.data()['jenisBarang'],
				jumlahBarang: e.payload.doc.data()['jumlahBarang']
				};
			})
		})
		this.orderManagement.getListPinjam(this.dataOrder.id).subscribe(data => {
      		this.dataPinjam = data.map(e => {
      				return {
  	           	//id: e.payload.doc.id,
  	           	serialNumber: e.payload.doc.data()['serialNumber'],
      			};
          })
        })
      this.orderManagement.getLogStatus(this.dataOrder['id']).subscribe(data => {
          this.logStatus = data.map(e => {
            return {
              id: e.payload.doc.id,
              status: e.payload.doc.data()['status'],
              tanggal: this.timeConverter(e.payload.doc.data()['tanggal']),
              user: e.payload.doc.data()['user'],
            };
          })
      });
      this.hideLoader();
  	}
  	async checkOrder(listRequest, dataOrder) {
  		/*const alert = await this.alertController.create({
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

	    await alert.present();*/
	    this.closeModal();
	    const modal = await this.modalController.create({
      		component: OrderCheckPage,
      		componentProps: {
        		"paramTitle": "Cek Barang",
        		"dataOrder" : dataOrder,
        		"listRequest" : listRequest,
        		//"isAdmin" : this.isAdmin
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
    async orderSelesai(id) {
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

  	            	this.orderManagement.getListBarangPinjam(id).get()
        						.then(snapshot => {
        							this.tempArray = [];
        							snapshot.forEach(e=> {
                        this.tempArray.push(e.data()['serialNumber']);
                          //console.log(e.data()['serialNumber']);
  	          				     //this.ubahStatusBarang(e.data()['serialNumber'], 'Available');
                           //this.addLog(e.data()['serialNumber'], 'Selesai Pinjam');
  						         })
                       for(let i=0; i<this.tempArray.length; i++){
                          this.ubahStatusBarang(this.tempArray[i], 'Available');
                          this.addLog(this.tempArray[i], 'Selesai Pinjam');
                        }
  					      })
                  //console.log(this.tempArray);



  					  let updateStatusPinjam = {};
  				    updateStatusPinjam['status'] = 'Selesai';
  				    updateStatusPinjam['adminPinjam'] = this.userEmail;
  				    updateStatusPinjam['lastModified'] = Math.floor(new Date().getTime()/1000.0);
  				    this.orderManagement.updateOrder(id,updateStatusPinjam);
              let dataLog = {};
              dataLog['status'] = "Selesai";
              dataLog['user'] = this.userEmail;
              dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
              this.orderManagement.addLogOrder(id,dataLog);
  				    this.showAlert();
  	        	}
	    	    }
	      	]
	    });

	    await alert.present();
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
    async showAlert() {
      let alert = await this.alertController.create({
        header: 'Berhasil!',
	    message: 'Pemesanan Selesai',
      });
      alert.present();
      setTimeout(()=>{
          alert.dismiss();
      }, 1000);
    }
  	async prosesOrder(orderID){
      const alert = await this.alertController.create({
          header: 'Konfirmasi!',
          message: 'Proses Order?',
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
                let updateStatusPinjam = {};
                updateStatusPinjam['status'] = 'Menyiapkan Barang';
                updateStatusPinjam['adminPinjam'] = this.userEmail;
                updateStatusPinjam['lastModified'] = Math.floor(new Date().getTime()/1000.0);
                this.orderManagement.updateOrder(orderID,updateStatusPinjam);
                let dataLog = {};
                dataLog['status'] = "Menyiapkan Barang";
                dataLog['user'] = this.userEmail;
                dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
                this.orderManagement.addLogOrder(orderID,dataLog);
                //this.showAlert();
                }
            }
          ]
      });
      await alert.present();
  	}
  	async closeModal() {
    	await this.modalController.dismiss();
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
  	async requestPengembalian(orderID) {
	    const alert = await this.alertController.create({
	      	header: 'Konfirmasi!',
	      	message: 'Peminjaman Selesai?',
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
					let updateStatusPinjam = {};
				    updateStatusPinjam['status'] = 'Request Pengembalian';
				    updateStatusPinjam['adminPinjam'] = this.userEmail;
				    updateStatusPinjam['lastModified'] = Math.floor(new Date().getTime()/1000.0);
				    this.orderManagement.updateOrder(orderID,updateStatusPinjam);
            let dataLog = {};
            dataLog['status'] = "Request Pengembalian";
            dataLog['user'] = this.userEmail;
            dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
            this.orderManagement.addLogOrder(orderID,dataLog);
				    this.showAlert();
	        	}
	    	}
	      	]
	    });
	    await alert.present();
	}
  async barangSiap(dataRequest, dataOrder) {
    this.closeModal();
    const modal = await this.modalController.create({
        component: OrderPreparePage,
        componentProps: {
          "paramTitle": "Menyiapkan Barang",
          "dataOrder" : dataOrder,
          "listRequest" : dataRequest,
          //set status order : preparing
        },
    });

    modal.onDidDismiss().then((dataReturned) => {
        if (dataReturned !== null) {
          this.dataReturned = dataReturned.data;
          //alert('Modal Sent Data :'+ dataReturned);
        }
    });

    let updateStatusPinjam = {};
    //updateStatusPinjam['status'] = 'Menyiapkan Barang';
    updateStatusPinjam['adminPinjam'] = this.userEmail;
    updateStatusPinjam['lastModified'] = Math.floor(new Date().getTime()/1000.0);
    this.orderManagement.updateOrder(dataOrder.id,updateStatusPinjam);

    return await modal.present();
  }
  async terimaBarang(orderID) {
    const alert = await this.alertController.create({
        header: 'Konfirmasi!',
        message: 'Barang sudah dikembalikan?',
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
              let updateStatusPinjam = {};
              updateStatusPinjam['status'] = 'Terima Barang';
              updateStatusPinjam['adminPinjam'] = this.userEmail;
              updateStatusPinjam['lastModified'] = Math.floor(new Date().getTime()/1000.0);
              this.orderManagement.updateOrder(orderID,updateStatusPinjam);
              let dataLog = {};
              dataLog['status'] = "Terima Barang";
              dataLog['user'] = this.userEmail;
              dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
              this.orderManagement.addLogOrder(orderID,dataLog);
              //this.showAlert();
              }
          }
        ]
    });
    await alert.present();
  }
  timeConverter(UNIX_timestamp){
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


}
