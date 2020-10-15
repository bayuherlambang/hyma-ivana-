import { Component, OnInit } from '@angular/core';
import { StockManagementService } from '../services/stock-management.service';
import { LoadingController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-stock-opname',
  templateUrl: './stock-opname.page.html',
  styleUrls: ['./stock-opname.page.scss'],
})
export class StockOpnamePage implements OnInit {
  stockOpnameForm : FormGroup;
	loaderToShow : any;
	tablestyle = 'bootstrap';
	public stockOpname: Array<any>;
	jenisBarang: Array<any>;
	tanggal : string;
	masuk : string;
	keluar : string;
	jumlah : string;
	keterangan : string;
	selectedJenisBarang : string;
	status : string;
  sumbitDisabled: boolean = false;
  constructor(
		private stockManagement : StockManagementService,
		public loadingController: LoadingController,
    public fb : FormBuilder,
  	) {
      this.stockOpnameForm = fb.group({
        start: ['', Validators.compose([Validators.required])],
        end: ['', Validators.compose([Validators.required])],
        jenisBarang : ['', Validators.compose([Validators.required])],
       });
    }

    columns = [
    { name: 'Tanggal', prop: 'tanggal', width:'80'},
    { name: 'Masuk', prop: 'masuk', width:'50'},
    { name: 'Keluar', prop: 'keluar', width:'50'},
    { name: 'Jumlah', prop: 'jumlah', width:'58'},
    { name: 'Keterangan', prop: 'keterangan', width:'100'},
  ];

  ngOnInit() {
  		this.stockManagement.readJenisBarang().get()
	   		.then(snapshot => {
	   			this.jenisBarang = [];
	   			snapshot.forEach(e=> {
	   				this.jenisBarang.push(e.data());
	   			});

	        	return this.jenisBarang;
        });

	   	/*
  		this.stockManagement.stockOpname().subscribe(data => {
	      this.stockOpname = data.map(e => {
	        return {
	          //id: e.payload.doc.id,
	          tanggal: this.timeConverter(e.payload.doc.data()['tanggal']),
	          masuk: e.payload.doc.data()['barangMasuk'],
	          keluar: e.payload.doc.data()['barangKeluar'],
	          jumlah: e.payload.doc.data()['jmlheadset'],
	          keterangan: e.payload.doc.data()['keterangan'],
	        };
	      })
        });
        */
  }
  onSubmit(){
    this.showLoader("Memuat data");
    let data = this.stockOpnameForm.value;
    let start = Math.floor(new Date(data['start']).getTime()/1000.0);
    let end =  Math.floor(new Date(data['end']).getTime()/1000.0);
    let jenisBarang =  data['jenisBarang'];
    //console.log(this.stockOpnameForm.value);
    this.checkTanggal(start, end);

    this.stockManagement.stockOpname(start, end, jenisBarang).subscribe(data => {
    this.stockOpname = data.map(e => {
      return {
        //id: e.payload.doc.id,
        tanggal: this.timeConverter(e.payload.doc.data()['tanggal']),
        masuk: e.payload.doc.data()['barangMasuk'],
        keluar: e.payload.doc.data()['barangKeluar'],
        jumlah: e.payload.doc.data()['jmlBarang'],
        keterangan: e.payload.doc.data()['keterangan'],
      };
      })
      this.hideLoader();
    });

  }

  checkTanggal(start, end) {
  		if (start > end){
  			this.status = 'Periksa inputan tanggal!';
        //this.sumbitDisabled = true;
  			return;
  		}
	}

  checkStatus($event) {
      let q = $event.target.value;
      let stocks;
      //console.log(q);
      if (!q) {
        this.status = 'Pilih Jenis Barang';
        //this.sumbitDisabled = true;
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
	  let time = date + '/' + a.getMonth() + '/' + year;
	  return time;
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
