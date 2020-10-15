import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, ModalController } from '@ionic/angular';
import { OrderManagementService } from '../services/order-management.service';
import { OrderFormPage } from '../order-form/order-form.page';
import { OrderShowPage } from '../order-show/order-show.page';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { LoadingController } from '@ionic/angular';
import { AuthenticateService } from '../services/authenticate.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {

	dataReturned:any;
	public orders: Array<any>;
  public loadedOrder : any[];
  isAdminStock : boolean;
  role : any;
	namaPeminjam : string;
	adminOrder : string;
	adminReturn : string;
	waktuPinjam : string;
	waktuKembali : string;
	status : string;
	listRequest : Array<any>;
	jenisBarang : string;
	jumlahBarang : string;
	isEdit : boolean;
	tempArray : Array<any>;
	loaderToShow: any;
	userEmail : any;
	isAdmin : boolean;
  selectedStatusOrder : any;
  	constructor(
      public storage : Storage,
  		public modalController: ModalController,
  		private authService: AuthenticateService,
  		private orderManagement : OrderManagementService,
  		public loadingController: LoadingController
  	) {
      this.selectedStatusOrder = "all";
    }


  	ngOnInit() {
  		this.showLoader("Memuat");
      this.selectedStatusOrder = "all";
      this.userEmail = this.authService.userDetails().email.split("@");
      this.userEmail = this.userEmail[0];
  		this.authService.isAdmin()
      		.then((res) =>{
      			if(res){
      				this.isAdmin = true;
              //console.log(this.isAdmin);
      		 		this.orderManagement.readOrder().subscribe(data => {
				      	this.orders = data.map(e => {
				        	return {
					           id: e.payload.doc.id,
					           namaPeminjam: e.payload.doc.data()['namaPeminjam'],
					           createdAt: this.timeConverter(e.payload.doc.data()['createdAt']),
					           adminPinjam: e.payload.doc.data()['adminOrder'],
					           adminKembali: e.payload.doc.data()['adminReturn'],
					           waktuPinjam : e.payload.doc.data()['waktuPinjam'],
					           waktuKembali: this.timeConverter(e.payload.doc.data()['waktuKembali']),
					           status: e.payload.doc.data()['status'],
					        };
				      	})
                this.loadedOrder = this.orders;
				      	this.hideLoader();
			        });
      		 	}
      		 	else
      		 	{
      		 		this.isAdmin = false;
      		 		this.orderManagement.readOrderUser(this.userEmail).subscribe(data => {
				      	this.orders = data.map(e => {
				        	return {
					           id: e.payload.doc.id,
					           namaPeminjam: e.payload.doc.data()['namaPeminjam'],
					           createdAt: this.timeConverter(e.payload.doc.data()['createdAt']),
					           adminPinjam: e.payload.doc.data()['adminOrder'],
					           adminKembali: e.payload.doc.data()['adminReturn'],
					           waktuPinjam : e.payload.doc.data()['waktuPinjam'],
					           waktuKembali: this.timeConverter(e.payload.doc.data()['waktuKembali']),
					           status: e.payload.doc.data()['status'],
					        };
				      	})
                this.loadedOrder = this.orders;
				      	this.hideLoader();
			        });
      		 	}
      		})
    		.catch(function (err) {
    			console.log("ERROR:"+ err);
    	});
      this.authService.getRole()
      		.then((res) =>{
      			if(res){
      				//this.isAdminStock = true;
              this.role = res;
            }else{
              //this.isAdminStock = false;
            }
          })
          .catch(function (err) {
            console.log("ERROR:"+ err);
          });
        //  console.log(this.isAdmin);
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
    getListOrder(orderID){
    		this.orderManagement.readListRequest(orderID).subscribe(data => {
  			this.tempArray = data.map(e => {
  			return {
  	           	id: e.payload.doc.id,
  					jenisBarang: e.payload.doc.data()['jenisBarang'],
  					jumlahBarang: e.payload.doc.data()['jumlahBarang']
  				};
  			})
  			return this.tempArray;
  		})
    	}
    async detail(order){
    		const modal = await this.modalController.create({
        		component: OrderShowPage,
        		componentProps: {
          		"paramTitle": "Detail Peminjaman",
          		"dataOrder" : order,
          		"isAdmin" : this.isAdmin,
              //"isAdminStock" : this.isAdminStock,
              "role" : this.role
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
    async addPeminjaman(){
      	const modal = await this.modalController.create({
        		component: OrderFormPage,
        		componentProps: {
          		"paramTitle": "Peminjaman Baru",
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
    segmentChanged(ev: any) {
       //console.log('Segment changed', ev.target.value);
       this.showLoader("Memuat");
       if(this.isAdmin == true){
         if(ev.target.value == "all"){
           this.orderManagement.readOrder().subscribe(data => {
             this.orders = data.map(e => {
               return {
                  id: e.payload.doc.id,
                  namaPeminjam: e.payload.doc.data()['namaPeminjam'],
                  createdAt: this.timeConverter(e.payload.doc.data()['createdAt']),
                  adminPinjam: e.payload.doc.data()['adminOrder'],
                  adminKembali: e.payload.doc.data()['adminReturn'],
                  waktuPinjam : e.payload.doc.data()['waktuPinjam'],
                  waktuKembali: this.timeConverter(e.payload.doc.data()['waktuKembali']),
                  status: e.payload.doc.data()['status'],
               };
             })
             this.hideLoader();
           });
         }else if(ev.target.value == "waiting"){
           let status = ['Logged', 'Request Pengembalian'];
           this.orderManagement.getOrderByMultipleStatus(status).subscribe(data => {
             this.orders = data.map(e => {
               return {
                  id: e.payload.doc.id,
                  namaPeminjam: e.payload.doc.data()['namaPeminjam'],
                  createdAt: this.timeConverter(e.payload.doc.data()['createdAt']),
                  adminPinjam: e.payload.doc.data()['adminOrder'],
                  adminKembali: e.payload.doc.data()['adminReturn'],
                  waktuPinjam : e.payload.doc.data()['waktuPinjam'],
                  waktuKembali: this.timeConverter(e.payload.doc.data()['waktuKembali']),
                  status: e.payload.doc.data()['status'],
               };
             })
             this.hideLoader();
           });

         }else if(ev.target.value == "complete"){
           let status = ['Selesai'];
           this.orderManagement.getOrderByMultipleStatus(status).subscribe(data => {
             this.orders = data.map(e => {
               return {
                  id: e.payload.doc.id,
                  namaPeminjam: e.payload.doc.data()['namaPeminjam'],
                  createdAt: this.timeConverter(e.payload.doc.data()['createdAt']),
                  adminPinjam: e.payload.doc.data()['adminOrder'],
                  adminKembali: e.payload.doc.data()['adminReturn'],
                  waktuPinjam : e.payload.doc.data()['waktuPinjam'],
                  waktuKembali: this.timeConverter(e.payload.doc.data()['waktuKembali']),
                  status: e.payload.doc.data()['status'],
               };
             })
             this.hideLoader();
           });
         }
       }else{
         if(ev.target.value == "all"){
           this.orderManagement.readOrderUser(this.userEmail).subscribe(data => {
             this.orders = data.map(e => {
               return {
                  id: e.payload.doc.id,
                  namaPeminjam: e.payload.doc.data()['namaPeminjam'],
                  createdAt: this.timeConverter(e.payload.doc.data()['createdAt']),
                  adminPinjam: e.payload.doc.data()['adminOrder'],
                  adminKembali: e.payload.doc.data()['adminReturn'],
                  waktuPinjam : e.payload.doc.data()['waktuPinjam'],
                  waktuKembali: this.timeConverter(e.payload.doc.data()['waktuKembali']),
                  status: e.payload.doc.data()['status'],
               };
             })
             this.hideLoader();
           });
         }else if(ev.target.value == "waiting"){
           let status = ['Logged', 'Request Pengembalian'];
           this.orderManagement.getOrderByMultipleUserStatus(this.userEmail, status).subscribe(data => {
             this.orders = data.map(e => {
               return {
                  id: e.payload.doc.id,
                  namaPeminjam: e.payload.doc.data()['namaPeminjam'],
                  createdAt: this.timeConverter(e.payload.doc.data()['createdAt']),
                  adminPinjam: e.payload.doc.data()['adminOrder'],
                  adminKembali: e.payload.doc.data()['adminReturn'],
                  waktuPinjam : e.payload.doc.data()['waktuPinjam'],
                  waktuKembali: this.timeConverter(e.payload.doc.data()['waktuKembali']),
                  status: e.payload.doc.data()['status'],
               };
             })
             this.hideLoader();
           });

         }else if(ev.target.value == "complete"){
           let status = ['Selesai'];
           this.orderManagement.getOrderByMultipleUserStatus(this.userEmail, status).subscribe(data => {
             this.orders = data.map(e => {
               return {
                  id: e.payload.doc.id,
                  namaPeminjam: e.payload.doc.data()['namaPeminjam'],
                  createdAt: this.timeConverter(e.payload.doc.data()['createdAt']),
                  adminPinjam: e.payload.doc.data()['adminOrder'],
                  adminKembali: e.payload.doc.data()['adminReturn'],
                  waktuPinjam : e.payload.doc.data()['waktuPinjam'],
                  waktuKembali: this.timeConverter(e.payload.doc.data()['waktuKembali']),
                  status: e.payload.doc.data()['status'],
               };
             })
             this.hideLoader();
           });
         }
       }
     }
    initializeItems(): void {
      this.orders = this.loadedOrder;
    }
    filterList(evt) {
      this.initializeItems();
      const searchTerm = evt.target.value;
      console.log(searchTerm);
      if (!searchTerm) {
        return;
      }
      this.orders = this.orders.filter(currentGoal => {
        if (currentGoal.namaPeminjam && searchTerm) {
          if (currentGoal.namaPeminjam.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
            return true;
          }
          return false;
        }
      });
    }
    doRefresh(event){
      //console.log('Begin async operation');
      this.selectedStatusOrder = "all";
      this.ngOnInit();
      setTimeout(() => {
        //console.log('Async operation has ended');
        event.target.complete();
      }, 0);
    }

}
