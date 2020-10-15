import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { StockManagementService } from '../services/stock-management.service';
import { AuthenticateService } from '../services/authenticate.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'app-barang-keluar',
	templateUrl: './barang-keluar.page.html',
	styleUrls: ['./barang-keluar.page.scss'],
})
export class BarangKeluarPage implements OnInit {
	title : string;
	test : any;
	preAddForm : FormGroup;
	formListBarang : FormGroup;
	public jenisBarang: Array<any>;
	public kondisiBarang: Array<any>;
	public statusBarang: Array<any>;
	public keperluan: Array<any>;
	tempArray : Array<any>;
	idBarang : Array<any>;

	selectedKeperluanBarang : string;
	selectedJenisBarang : any;
	inputJumlah : number;
	scannedBarCode : any;

	showlist:any;
	preAddFromShow:any;
	userEmail: any;
	loaderToShow : any;


	public barang : any;
	jmlBarang : any;
	sumbitDisabled: any = false;
	statusSucces: any;
	statusError: any;
	statusInfo: any;
	showuploadform : any;
	uploadedFile : any;
	jsonUpload: any;
	uploadButton: any;

  constructor(
			private storage: Storage,
	  	private modalController: ModalController,
			public loadingController: LoadingController,
			private barcodeScanner: BarcodeScanner,
			private stockManagement : StockManagementService,
			private authService: AuthenticateService,
			public alertController: AlertController,
			//private navParams: NavParams,
			private fb: FormBuilder
		) {
			this.storage.get('username').then((val) => {
        this.userEmail = val;
      });
	    this.preAddForm = fb.group({
				selectedKeperluanBarang: ['',Validators.compose([Validators.required])],
				selectedJenisBarang: ['',Validators.compose([Validators.required])],
				jumlahBarang: ['',Validators.compose([Validators.required])],
			});
			this.formListBarang = fb.group({
	      	listBarang: this.fb.array([]) ,
	    })
  	}

  	ngOnInit() {
  		this.title = "Barang Keluar";
			this.showlist = false;
			this.preAddFromShow =true;
  		this.stockManagement.readJenisBarang().get()
	   		.then(snapshot => {
	   			this.jenisBarang = [];
	   			snapshot.forEach(e=> {
	   				this.jenisBarang.push(e.data());
	   			});
	    });
	   	//console.log(this.jenisBarang);
	    this.stockManagement.readKondisiBarang().get()
	   		.then(snapshot => {
	   			this.kondisiBarang = [];
	   			snapshot.forEach(e=> {
	   				this.kondisiBarang.push(e.data());
	   			});
	    });
	    this.stockManagement.readStatusBarang().get()
	   		.then(snapshot => {
	   			this.statusBarang = [];
	   			snapshot.forEach(e=> {
	   				this.statusBarang.push(e.data());
	   			});
	    });
	    this.stockManagement.readOpsiBarangKeluar().get()
	   		.then(snapshot => {
	   			this.keperluan = [];
	   			snapshot.forEach(e=> {
	   				this.keperluan.push(e.data());
	   			});
	    });

  	}
  	listBarang(): FormArray {
    	return this.formListBarang.get("listBarang") as FormArray
    }
  	newListBarang(keperluan): FormGroup {
			if(keperluan == 'Agent Baru'){
	    	return this.fb.group({
	      		serialNumber: ['',Validators.compose([Validators.required])],
	      		owner: ['',Validators.compose([Validators.required])],
	    	})
			}else if(keperluan == 'Retur/Rusak'){
				return this.fb.group({
						serialNumber: ['',Validators.compose([Validators.required])],
						owner: [''],
				})
			}
  	}
  	addListBarang(keperluan) {
    	this.listBarang().push(this.newListBarang(keperluan));
  	}
  	removeListBarang(jenisIndex:number) {
    	this.listBarang().removeAt(jenisIndex);
  	}
  	submitPreAdd(){
		//this.inputJumlah = 0;
	  	this.selectedKeperluanBarang = this.preAddForm.controls["selectedKeperluanBarang"].value;
	  	this.selectedJenisBarang = this.preAddForm.controls["selectedJenisBarang"].value;
	  	//this.selectedStatusBarang = "Available";

	  	this.inputJumlah = this.preAddForm.controls["jumlahBarang"].value;
	  	this.scannedBarCode = new Array(this.inputJumlah);
	  	for(let i=0; i<this.inputJumlah; i++){
	  		this.addListBarang(this.selectedKeperluanBarang);
	  	}

			this.preAddFromShow=false;
	  	this.showlist = true;
		}
		submitBarang(){
			this.preAddForm.reset();
			let listBarang = {};
	    let record = this.formListBarang.value['listBarang'];
			this.showLoader('Mengirim data');
			//console.log(record.length);
			this.jmlBarang = [];
   		this.stockManagement.getDataBarang(this.selectedJenisBarang).get().then(snapshot => {
	      this.barang = snapshot.size;
	      this.jmlBarang.push(this.barang);
				let dataStockOpname = {};
				dataStockOpname['tanggal'] = Math.floor(new Date().getTime()/1000.0);
				dataStockOpname['barangKeluar'] = record.length;
				dataStockOpname['barangMasuk'] = "";
				dataStockOpname['jenisBarang'] = this.selectedJenisBarang;
				dataStockOpname['keterangan'] = this.selectedKeperluanBarang;
				dataStockOpname['jmlBarang'] =  this.barang - record.length;
				this.stockManagement.addStockopname(dataStockOpname).then(resp => {

				}).catch(error => {

				});
				if(this.selectedKeperluanBarang == 'Agent Baru'){
	    		for(let i=0; i<record.length; i++){
						this.stockManagement.getIDBarang(record[i]['serialNumber']).get()
							.then(snapshot => {
								this.tempArray = [];
								snapshot.forEach(e=> {
									this.tempArray.push(e.id);
									let id = e.id;
									let dataUpdate = {};
									dataUpdate['ownerBarang'] = record[i]['owner'];
									dataUpdate['statusBarang'] = "Dedicated";
									dataUpdate['updatedAt'] = Math.floor(new Date().getTime()/1000.0);
									dataUpdate['updatedBy'] = this.userEmail;
									this.stockManagement.updateStock(id, dataUpdate);
									let dataLog = {};
									dataLog['status'] = "Dedicated Agent";
									dataLog['user'] = record[i]['owner'];
									dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
									this.stockManagement.addLogUser(id,dataLog);
								});
								//let id = this.tempArray[0];
								//console.log(id);
						});
	    		}
					//this.hideLoader();
	    	}else if(this.selectedKeperluanBarang == 'Retur/Rusak'){

	    		for(let i=0; i<record.length; i++){
	    			this.stockManagement.getIDStock(record[i]['serialNumber']).subscribe(data => {
			          	this.tempArray = data.map(e => {
			              	return {
			                	id: e.payload.doc.id
			              	};
			           	})
			          	let id=this.tempArray[0]['id'];
			          	this.stockManagement.deleteStock(id);
			      });
	    		}

	    	}
      });
    	while(this.listBarang().controls.length !== 0){
    		this.removeListBarang(0);
    	}
	    //this.hideLoader();
			//this.presentAlert();
	    this.preAddFromShow=true;
	  	this.showlist = false;
    }
		scanBarCode(index) {
      this.barcodeScanner.scan().then(barcodeData => {
          this.scannedBarCode[index] = barcodeData.text;
      }, (err) => {
          console.log('Error: ', err);
      });
    }
		async presentAlert() {
	    const alert = await this.alertController.create({
	      header: 'Horee',
	      message: 'Berhasil.',
	      buttons: ['OK']
	    });

	    await alert.present();
	  }
		async showLoader(msg) {
	    const loading = await this.loadingController.create({
	      message: msg,
	      duration: 1000
	    });
	    await loading.present();

	    const { role, data } = await loading.onDidDismiss();
	    console.log('Loading dismissed!');
	  }
		/*
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
		*/
	  hideLoader() {
	    setTimeout(() => {
	        this.loadingController.dismiss();
	    }, 100);
	  }
    checkStatus($event) {
      let q = $event.target.value;
      let stocks;
      if (q.trim() == '') {
        this.statusError = 'Masukan SN barang';
				this.statusSucces = '';
        //this.sumbitDisabled = true;
      }
      else {
        this.statusSucces = 'Checking.. !!';
        this.stockManagement.getIDStock(q).subscribe(data => {
          stocks = data.map(e => {
            return {
							statusBarang: e.payload.doc.data()['statusBarang'],
							jenisBarang: e.payload.doc.data()['jenisBarang'],
            };
          })
					if(stocks[0]){
						if(stocks[0]['statusBarang'] != "Available"){
							this.statusError = 'Barang tidak tersedia!';
							this.statusSucces = '';
							//this.sumbitDisabled = true;
						}else{
							this.statusSucces = 'Barang tersedia';
							this.statusError = '';
						}
					}else{
						this.statusSucces = '';
						this.statusError = 'Barang tidak terdaftar';
						//this.sumbitDisabled = false;
					}
        });
      }
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
					dataLog['user'] = this.userEmail;
					dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
					this.stockManagement.addLogUser(id,dataLog);

			});
    }
		importfile(){
			this.selectedKeperluanBarang = this.preAddForm.controls["selectedKeperluanBarang"].value;
			this.selectedJenisBarang = this.preAddForm.controls["selectedJenisBarang"].value;
			this.inputJumlah = this.preAddForm.controls["jumlahBarang"].value;

			this.jmlBarang = [];
			this.stockManagement.getDataBarang(this.selectedJenisBarang).get().then(snapshot => {
				let jml;
				if(snapshot.size){
					jml = snapshot.size;
				}else{
					jml = 0;
				}
				console.log(jml);
				//this.jmlBarang.push(this.barang);
			});

			console.log(this.jmlBarang);
			this.preAddFromShow=false;
			this.showuploadform = true;
		}
		uploadFile(files: FileList) {
	    let results = [];
	    if (files && files.length > 0) {
	      const file: File = files.item(0);//assuming only one file is uploaded
	      console.log('Uplaoded file, Filename:' + file.name + 'Filesize:' + file.size + 'Filetype:' + file.type);
	      const reader: FileReader = new FileReader();
	      reader.readAsText(file);
	      reader.onload = (e) => {
	        //const fileContent: string = reader.result as string;
	        this.uploadedFile = reader.result;
	        this.jsonUpload = JSON.parse(this.uploadedFile);
	        this.jmlBarang = [];
	        this.uploadButton = true;
	        //console.log(this.jsonUpload);
	      };
	    }
	  }
	  uploadjson(){
	    this.showLoader("Mengupload Data");
			this.preAddForm.reset();
			let dataStockOpname = {};
			dataStockOpname['tanggal'] = Math.floor(new Date().getTime()/1000.0);
			dataStockOpname['barangKeluar'] = this.jsonUpload.length;
			dataStockOpname['barangMasuk'] = "";
			dataStockOpname['jenisBarang'] = this.selectedJenisBarang;
			dataStockOpname['keterangan'] = this.selectedKeperluanBarang;
			dataStockOpname['jmlBarang'] =  this.jsonUpload.length;

			this.stockManagement.addStockopname(dataStockOpname).then(resp => {
				this.hideLoader();
				this.presentAlertSuccess();
			}).catch(error => {
				this.hideLoader();
				this.presentAlertFail();
			});
			if(this.selectedKeperluanBarang == 'Agent Baru'){
				for(let i=0; i<this.jsonUpload.length; i++){
					this.stockManagement.getIDBarang(this.jsonUpload[i]['serialNumber']).get()
						.then(snapshot => {
							this.tempArray = [];
							snapshot.forEach(e=> {
								//this.tempArray.push(e.id);
								let id = e.id;
								let dataUpdate = {};
								dataUpdate['ownerBarang'] = this.jsonUpload[i]['ownerBarang'];
								dataUpdate['statusBarang'] = "Dedicated";
								dataUpdate['updatedAt'] = Math.floor(new Date().getTime()/1000.0);
								dataUpdate['updatedBy'] = this.userEmail;
								this.stockManagement.updateStock(id, dataUpdate);
								let dataLog = {};
								dataLog['status'] = "Dedicated Agent";
								dataLog['user'] = this.jsonUpload[i]['ownerBarang'];
								dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
								this.stockManagement.addLogUser(id,dataLog);
								console.log(i +"-->"+ this.jsonUpload[i]['serialNumber']);
							});

					});
				}
			}else if(this.selectedKeperluanBarang == 'Retur/Rusak'){
				for(let i=0; i<this.jsonUpload.length; i++){
    			this.stockManagement.getIDStock(this.jsonUpload[i]['serialNumber']).subscribe(data => {
		          	this.tempArray = data.map(e => {
		              	return {
		                	id: e.payload.doc.id
		              	};
		           	})
		          	let id=this.tempArray[0]['id'];
		          	this.stockManagement.deleteStock(id);
		      	});
    		}
			}

			this.hideLoader();
	    this.preAddFromShow=true;
	  	this.showuploadform = false;

	  }
		async presentAlertSuccess() {
	    const alert = await this.alertController.create({
	      header: 'Berhasil',
	      message: 'Upload data berhasil.',
	      buttons: ['OK']
	    });

	    await alert.present();
	  }
	  async presentAlertFail() {
	    const alert = await this.alertController.create({
	      header: 'Gagal',
	      message: 'Gagal upload data.',
	      buttons: ['OK']
	    });

	    await alert.present();
	  }
		// cobaprogress(){
		// 	for(let i = 0; i<=100; i++){
		// 		setTimeout(function(){
		//         this.test = i;
		//     }, 3000);
		// 	}
		// }
}
