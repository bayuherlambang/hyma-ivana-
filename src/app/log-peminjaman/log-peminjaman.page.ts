import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StockManagementService } from '../services/stock-management.service';
import { AuthenticateService } from '../services/authenticate.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import { OrderManagementService } from '../services/order-management.service';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { OrderShowPage } from '../order-show/order-show.page';

@Component({
  selector: 'app-log-peminjaman',
  templateUrl: './log-peminjaman.page.html',
  styleUrls: ['./log-peminjaman.page.scss'],
})
export class LogPeminjamanPage implements OnInit {
	logForm: FormGroup;
	title : string;
	status = '';
	dataOrder : any;
	sumbitDisabled: boolean = false;
  isAdmin : any;
  userEmail : any;
  loaderToShow : any;

  	constructor(
      private storage: Storage,
      public modalController: ModalController,
  		private stockManagement : StockManagementService,
  		private orderManagement : OrderManagementService,
  		private authService: AuthenticateService,
  		private fb: FormBuilder,
      private loadingController : LoadingController
  	) {
  		this.logForm = fb.group({
    		start: ['', Validators.compose([Validators.required])],
    		end: ['', Validators.compose([Validators.required])],
		   });

      this.userEmail = this.authService.userDetails().email.split("@");
      this.userEmail = this.userEmail[0];
    }
  ngOnInit() {
    this.authService.isAdmin()
        .then((res) =>{
          if(res){
            this.isAdmin = true;
        }else{
          this.isAdmin = false;
        }
      	})
        .catch(function (err) {
          console.log("ERROR:"+ err);
    });
  }

  onSubmit(){
    this.showLoader("Memuat data");
    let data = this.logForm.value;
    let start = Math.floor(new Date(data['start']).getTime()/1000.0);
    let end =  Math.floor(new Date(data['end']).getTime()/1000.0);
    this.checkTanggal(start, end);
    if(this.isAdmin == true){
      this.orderManagement.readOrderbyInterval(start, end).subscribe(data => {
  			this.dataOrder = data.map(e => {
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
  		})
    }else{
      this.orderManagement.readOrderUserbyInterval(this.userEmail, start, end).subscribe(data => {
        this.dataOrder = data.map(e => {
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
      })
    }

  }
 	checkTanggal(start, end) {
  		if (start > end){
  			this.status = 'Periksa inputan tanggal!';
  			return;
  		}
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
  async detail(order){
      const modal = await this.modalController.create({
          component: OrderShowPage,
          componentProps: {
            "paramTitle": "Detail Peminjaman",
            "dataOrder" : order,
            "isAdmin" : this.isAdmin
          }
      });

      modal.onDidDismiss().then((dataReturned) => {
          if (dataReturned !== null) {
            //this.dataReturned = dataReturned.data;
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
    //this.hideLoader();
  }

  hideLoader() {
    setTimeout(() => {
        this.loadingController.dismiss();
    }, 100);
  }

}
