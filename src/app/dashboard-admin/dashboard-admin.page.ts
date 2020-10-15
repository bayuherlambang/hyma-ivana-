import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { AuthenticateService } from '../services/authenticate.service';
import { StockManagementService } from '../services/stock-management.service';
import { OrderManagementService } from '../services/order-management.service';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.page.html',
  styleUrls: ['./dashboard-admin.page.scss'],
})
export class DashboardAdminPage implements OnInit {
  loaderToShow : any;
  Barang: Array<any>;
  order: Array<any>;
	userEmail: string;
  jmlBarang: number = 0;
  jmlOrder: number = 0;
  constructor(
      private storage: Storage,
    	private navCtrl: NavController,
    	private authService: AuthenticateService,
      private stockManagement : StockManagementService,
      private orderManagement : OrderManagementService,
      public loadingController: LoadingController,
  	) {}
  ionViewDidEnter() {
	    document.addEventListener("backbutton",function(e) {
	      console.log("disable back button called from tab 1")
	    }, false);
	}
  
  ngOnInit() {
      //this.showLoader("Memuat data");
      this.storage.get('username').then((val) => {
        this.userEmail = val;
      });
      this.stockManagement.readJenisBarang().get()
        .then(snapshot => {
	   			this.Barang = [];
	   			snapshot.forEach(e=> {
            this.stockManagement.getDataBarang(e.data()['jenisBarang']).get().then(snapshot => {
              //console.log(snapshot.size);
      	      this.jmlBarang = snapshot.size;
      	      this.Barang.push({"jenisBarang" : e.data()['jenisBarang'],"jumlahBarang" : this.jmlBarang});
              });
	   			});
        });
        this.orderManagement.readStatusOrder().get()
  	   		.then(snapshot => {
  	   			this.order = [];
  	   			snapshot.forEach(e=> {
              if(e.data()['namaStatus'] == "Menyiapkan Barang" || e.data()['namaStatus'] == "Selesai"){
                //nothing
              }else{
                this.orderManagement.getOrderByStatus(e.data()['namaStatus']).get().then(data => {
            	     this.jmlOrder = data.size;
            	      this.order.push({"status" : e.data()['namaStatus'],"jumlah" : this.jmlOrder});
                });
              }
  	   			});
          });
  	}
  doRefresh(event){
      //console.log('Begin async operation');
      this.ngOnInit();
      setTimeout(() => {
        //console.log('Async operation has ended');
        event.target.complete();
      }, 0);
    }
  logout(){
    	this.authService.logoutUser()
    	.then(res => {
      		console.log(res);
      		this.navCtrl.navigateForward('');
    	})
    	.catch(error => {
      		console.log(error);
    	})
  	}
	stockPage(){
		this.navCtrl.navigateForward('/stock');
	}
	orderPage(){
		this.navCtrl.navigateForward('/order');
	}
	logPeminjaman(){
		this.navCtrl.navigateForward('/log-peminjaman');
	}
	validasiHeadset(){
		this.navCtrl.navigateForward('/validasiheadset');
	}
	stockOpname(){
		this.navCtrl.navigateForward('/stock-opname');
	}
	barangMasuk(){
		this.navCtrl.navigateForward('/barang-masuk');
	}
	barangKeluar(){
		this.navCtrl.navigateForward('/barang-keluar');
	}
  importfile(){
    this.navCtrl.navigateForward('/importfile');
  }
  showLoader(msg) {
    this.loaderToShow = this.loadingController.create({
      message: msg
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        //console.log('Loading dismissed!');
      });
    });
  }
  hideLoader() {
    setTimeout(() => {
        this.loadingController.dismiss();
    }, 0);
  }
}
