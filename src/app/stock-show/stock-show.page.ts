import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { StockManagementService } from '../services/stock-management.service';
import { AuthenticateService } from '../services/authenticate.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-stock-show',
  templateUrl: './stock-show.page.html',
  styleUrls: ['./stock-show.page.scss'],
})
export class StockShowPage implements OnInit {
  dataReturned:any;
	title : any;
	public stock: any;
  public logUser:any;
  loaderToShow: any;
  idBarang: any;

  constructor(
    private modalController: ModalController,
    public loadingController: LoadingController,
    private stockManagement : StockManagementService,
    private authService: AuthenticateService,
    private navParams: NavParams,
  ) { }

  ngOnInit() {
    this.showLoader();
    this.title = this.navParams.data.paramTitle;
    this.stock = this.navParams.data.stockData;

    this.stockManagement.getLogUser(this.stock['id']).subscribe(data => {
        this.logUser = data.map(e => {
          return {
            id: e.payload.doc.id,
            status: e.payload.doc.data()['status'],
            tanggal: this.timeConverter(e.payload.doc.data()['tanggal']),
            user: e.payload.doc.data()['user'],
          };
        })
        this.hideLoader();
    });
  }
  async closeModal() {
    await this.modalController.dismiss();
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

}
