import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { AuthenticateService } from '../services/authenticate.service';
import { StockManagementService } from '../services/stock-management.service';
import { OrderManagementService } from '../services/order-management.service';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-dashboard-user',
  templateUrl: './dashboard-user.page.html',
  styleUrls: ['./dashboard-user.page.scss'],
})
export class DashboardUserPage implements OnInit {
  Barang: Array<any>;
  order: Array<any>;
	userEmail: any;
  	constructor(
      private storage: Storage,
    	private navCtrl: NavController,
    	private authService: AuthenticateService,
      private stockManagement : StockManagementService,
      private orderManagement : OrderManagementService
  	) {}
  ionViewDidEnter() {
	    document.addEventListener("backbutton",function(e) {
	      console.log("disable back button called from tab 1")
	    }, false);
	}

  	ngOnInit() {
  		// if(this.authService.userDetails()){
      // 		this.userEmail = this.authService.userDetails().email.split("@");
      // 		this.userEmail = this.userEmail[0];
    	// }else{
      // 		this.navCtrl.navigateBack('');
    	// }
      this.storage.get('username').then((val) => {
        this.userEmail = val;
      });
      this.stockManagement.readJenisBarang().get()
	   		.then(snapshot => {
	   			this.Barang = [];
	   			snapshot.forEach(e=> {
            this.stockManagement.getDataBarang(e.data()['jenisBarang']).get().then(snapshot => {
              //console.log(snapshot.size);
      	      let jml = snapshot.size;
      	      this.Barang.push({"jenisBarang" : e.data()['jenisBarang'],"jumlahBarang" : jml});
              });
	   			});
            //console.log(this.jenisBarang);
	        	//return this.jenisBarang;
        });
        this.orderManagement.readStatusOrder().get()
  	   		.then(snapshot => {
  	   			this.order = [];
  	   			snapshot.forEach(e=> {
              if(e.data()['namaStatus'] == "Menyiapkan Barang" || e.data()['namaStatus'] == "Selesai"){
                //nothing
              }else{
                this.orderManagement.getOrderByUserStatus(this.userEmail, e.data()['namaStatus']).get().then(data => {
            	      let jml = data.size;
            	      this.order.push({"status" : e.data()['namaStatus'],"jumlah" : jml});
                });
              }
  	   			});
              //console.log(this.jenisBarang);
  	        	//return this.order;
          });
  	}
    doRefresh(event){
      //console.log('Begin async operation');
      this.ngOnInit();
      setTimeout(() => {
        console.log('Async operation has ended');
        event.target.complete();
      }, 10);
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
  	logout(){
    	this.authService.logoutUser()
    	.then(res => {
      		console.log(res);
      		this.navCtrl.navigateBack('');
    	})
    	.catch(error => {
      		console.log(error);
    	})
  	}
}
