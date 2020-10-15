import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { StockManagementService } from '../services/stock-management.service';
//import { ImportfilePage } from '../importfile/importfile.page';
import { AuthenticateService } from '../services/authenticate.service';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LoadingController } from '@ionic/angular';
import { RouterModule, Routes, Router } from "@angular/router";
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
	selector: 'app-barang-masuk',
	templateUrl: './barang-masuk.page.html',
	styleUrls: ['./barang-masuk.page.scss'],
})

export class BarangMasukPage implements OnInit {

	title : string;

	preAddForm : FormGroup;
	formListBarang : FormGroup;
	public jenisBarang: Array<any>;
	public kondisiBarang: Array<any>;
	public statusBarang: Array<any>;
	public sumberBarang: Array<any>;

	selectedSumberBarang : string;
	selectedJenisBarang : any;
	selectedKondisiBarang : string;
	selectedStatusBarang : string;
	inputJumlah : number;
	scannedBarCode : any;

	showlist:any;
	preAddFromShow:any;
	userEmail: any;
	loaderToShow : any;
	status : any;
	sumbitDisabled: any = false;
	public barang : any;
	jmlBarang : any;
	tempArray : any;
	statusSucces: any;
	statusError: any;
	uploadedFile: any;
	jsonUpload : any;
	showuploadform: any;
	uploadButton : any;

	Barang: Array<any>;
	jml: number = 0;

  constructor(
		private storage: Storage,
  	private platform: Platform,
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
		selectedSumberBarang: ['',Validators.compose([Validators.required])],
		selectedJenisBarang: ['',Validators.compose([Validators.required])],
		selectedKondisiBarang: ['',Validators.compose([Validators.required])],
		jumlahBarang: ['',Validators.compose([Validators.required])],
	});
		this.formListBarang = fb.group({
      		listBarang: this.fb.array([]) ,
    	})
  }

	ngOnInit() {
		this.title = "Barang Masuk";
		this.showlist = false;
		this.preAddFromShow =true;
		//this.sumbitDisabled = false;
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
	    this.stockManagement.readOpsiBarangMasuk().get()
	   		.then(snapshot => {
	   			this.sumberBarang = [];
	   			snapshot.forEach(e=> {
	   				this.sumberBarang.push(e.data());
	   			});
	    });
	  	//console.log(this.jmlHS[0]);
	}
	listBarang(): FormArray {
    	return this.formListBarang.get("listBarang") as FormArray
    }
  newListBarang(): FormGroup {
    	return this.fb.group({
      		serialNumber: ['',Validators.compose([Validators.required])],
    	})
  	}
  addListBarang() {
    	this.listBarang().push(this.newListBarang());
  	}
  removeListBarang(jenisIndex:number) {
    	this.listBarang().removeAt(jenisIndex);
  	}

	submitPreAdd(){
		//this.inputJumlah = 0;
	  	this.selectedSumberBarang = this.preAddForm.controls["selectedSumberBarang"].value;
	  	this.selectedJenisBarang = this.preAddForm.controls["selectedJenisBarang"].value;
	  	this.selectedKondisiBarang = this.preAddForm.controls["selectedKondisiBarang"].value;
	  	//this.selectedStatusBarang = "Available";
			/*
	  	this.jmlBarang = [];
   		this.stockManagement.getDataBarang(this.selectedJenisBarang).get().then(data => {
	      this.barang = data.size;
	      //console.log(this.headset);
	      this.jmlBarang.push(this.barang);
        });
   		//console.log(this.jmlBarang[0]);
			*/
	  	this.inputJumlah = this.preAddForm.controls["jumlahBarang"].value;
	  	this.scannedBarCode = new Array(this.inputJumlah);
	  	for(let i=0; i<this.inputJumlah; i++){
	  		this.addListBarang();
	  	}

			this.preAddFromShow=false;
	  	this.showlist = true;

	  	//console.log(this.listBarang());
	}
	importfile(){
		this.selectedSumberBarang = this.preAddForm.controls["selectedSumberBarang"].value;
		this.selectedJenisBarang = this.preAddForm.controls["selectedJenisBarang"].value;
		this.selectedKondisiBarang = this.preAddForm.controls["selectedKondisiBarang"].value;
		//this.selectedStatusBarang = "Available";
		this.jmlBarang = [];

		this.stockManagement.getDataBarang(this.selectedJenisBarang).get().then(data => {
			this.barang = data.size;
			console.log(data.size);
			//this.jmlBarang.push(this.barang);
			});
		//console.log(this.jmlBarang[0]);

		this.preAddFromShow=false;
		this.showuploadform = true;
	}
	submitBarang(){

		this.preAddForm.reset();
		/*
		let listBarang = {};
    let record = this.formListBarang.value['listBarang'];
    	//this.showLoader('Mengirim data');
		if(this.selectedSumberBarang == "Barang Baru"){
	    	for(let i=0; i<record.length; i++){
		    	//1. prepare upload data stock (owner = "")
	    		let data = {};
					data['serialNumber'] = record[i]['serialNumber'];
		    	data['ownerBarang'] = "";
		    	data['jenisBarang'] = this.selectedJenisBarang;
		    	data['kondisiBarang'] = this.selectedKondisiBarang;
		    	data['statusBarang'] = "Available";
		    	data['createdAt'] = String(Math.floor(new Date().getTime()/1000.0));
		    	data['updatedAt'] = "";
		    	data['createdBy'] = this.userEmail;
		    	data['updatedBy'] = "";
		    	//2. upload data stock
		    	this.stockManagement.addStock(data).then(resp => {
		    	})
					.catch(error => {
		        	console.log(error);
		      });
		      	//this.removeListBarang(i);
	    	}
	    	while(this.listBarang().controls.length !== 0){
	    		this.removeListBarang(0);
	    	}
				this.stockManagement.getDataBarang(this.selectedJenisBarang).get().then(snapshot => {
					let dataStockOpname = {};
		    	dataStockOpname['tanggal'] = Math.floor(new Date().getTime()/1000.0);
		    	dataStockOpname['barangKeluar'] = "";
		    	dataStockOpname['barangMasuk'] = record.length;
		    	dataStockOpname['jenisBarang'] = this.selectedJenisBarang;
		    	dataStockOpname['keterangan'] = this.selectedSumberBarang;
					let jml;
					if(snapshot.size){
						jml = snapshot.size;
					}else{
						jml = 0;
					}
					dataStockOpname['jmlBarang'] = jml+record.length;
					//console.log(dataStockOpname);
					this.stockManagement.addStockopname(dataStockOpname).then(resp => {
					})
				});

		}else if(this.selectedSumberBarang == "Agent Resign"){
				for(let i=0; i<record.length; i++){
		    	//1. prepare upload data stock (owner = "")
					this.stockManagement.getIDBarang(record[i]['serialNumber']).get()
						.then(snapshot => {
							this.tempArray = [];
							snapshot.forEach(e=> {
								this.tempArray.push(e.id);
								let id = e.id;
								let dataUpdate = {};
								//let data = {};
								dataUpdate['serialNumber'] = record[i]['serialNumber'];
								dataUpdate['ownerBarang'] = "";
								dataUpdate['jenisBarang'] = this.selectedJenisBarang;
								dataUpdate['kondisiBarang'] = this.selectedKondisiBarang;
								dataUpdate['statusBarang'] = "Available";
								dataUpdate['createdAt'] = "";
								dataUpdate['updatedAt'] = Math.floor(new Date().getTime()/1000.0);
								dataUpdate['createdBy'] = "";
								dataUpdate['updatedBy'] = this.userEmail;
								//2. upload data stock
								this.stockManagement.updateStock(id, dataUpdate);
								let dataLog = {};
								dataLog['status'] = "Agent Resign";
								dataLog['user'] = "";
								dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
								this.stockManagement.addLogUser(id,dataLog);
							});
							let id = this.tempArray[0];
							//console.log(id);

					});
		      	//this.removeListBarang(i);
					}

					this.stockManagement.getDataBarang(this.selectedJenisBarang).get().then(snapshot => {
						let jml;
						if(snapshot.size){
							jml = snapshot.size;
						}else{
							jml = 0;
						}
						console.log(jml);
						//this.jmlBarang.push(this.barang);

			    	let dataStockOpname = {};
			    	dataStockOpname['tanggal'] = Math.floor(new Date().getTime()/1000.0);
			    	dataStockOpname['barangKeluar'] = "";
			    	dataStockOpname['barangMasuk'] = record.length;
			    	dataStockOpname['jenisBarang'] = this.selectedJenisBarang;
			    	dataStockOpname['keterangan'] = this.selectedSumberBarang;
			    	dataStockOpname['jmlBarang'] = jml+record.length;
			    	//console.log(dataStockOpname);
			    	this.stockManagement.addStockopname(dataStockOpname).then(resp => {
				    })
				});
			}
			*/
			let record = this.formListBarang.value['listBarang'];
			this.Barang = [];
			this.stockManagement.getDataBarang(this.selectedJenisBarang).get().then(snapshot => {
				console.log(snapshot.size);
				this.jml = snapshot.size;
				this.Barang.push(this.jmlBarang);
				//this.showLoader("Mengirim data");
				let dataStockOpname = {};
				dataStockOpname['tanggal'] = Math.floor(new Date().getTime()/1000.0);
				dataStockOpname['barangKeluar'] = "";
				dataStockOpname['barangMasuk'] = record.length;
				dataStockOpname['jenisBarang'] = this.selectedJenisBarang;
				dataStockOpname['keterangan'] = this.selectedSumberBarang;
				dataStockOpname['jmlBarang'] = this.jml + record.length;
				console.log(dataStockOpname['jmlBarang']);
				this.stockManagement.addStockopname(dataStockOpname).then(resp => {
						let count = 0;
						if(this.selectedSumberBarang == "Barang Baru"){
							this.showLoader("Mengupload Data");
							for(let i=0; i<record.length; i++){
								//1. prepare upload data stock (owner = "")
								let data = {};
								data['serialNumber'] = record[i]['serialNumber'];
								data['ownerBarang'] = "";
								data['jenisBarang'] = this.selectedJenisBarang;
								data['kondisiBarang'] = this.selectedKondisiBarang;
								data['statusBarang'] = "Available";
								data['createdAt'] = String(Math.floor(new Date().getTime()/1000.0));
								data['updatedAt'] = "";
								data['createdBy'] = this.userEmail;
								data['updatedBy'] = "";
								//2. upload data stock
								this.stockManagement.addStock(data).then(resp => {

								})
								.catch(error => {
										console.log(error);
								});
								this.hideLoader();
							}
							this.hideLoader();
						}else if(this.selectedSumberBarang == "Agent Resign"){
							this.showLoader("Mengupload Data");
							for(let i=0; i<record.length; i++){
								//1. prepare upload data stock (owner = "")
								this.stockManagement.getIDBarang(record[i]['serialNumber']).get()
									.then(snapshot => {
										this.tempArray = [];
										snapshot.forEach(e=> {
											this.tempArray.push(e.id);
											let id = e.id;
											let dataUpdate = {};
											//let data = {};
											dataUpdate['serialNumber'] = record[i]['serialNumber'];
											dataUpdate['ownerBarang'] = "";
											dataUpdate['jenisBarang'] = this.selectedJenisBarang;
											dataUpdate['kondisiBarang'] = this.selectedKondisiBarang;
											dataUpdate['statusBarang'] = "Available";
											dataUpdate['createdAt'] = "";
											dataUpdate['updatedAt'] = Math.floor(new Date().getTime()/1000.0);
											dataUpdate['createdBy'] = "";
											dataUpdate['updatedBy'] = this.userEmail;
											//2. upload data stock
											this.stockManagement.updateStock(id, dataUpdate);
											let dataLog = {};
											dataLog['status'] = "Agent Resign";
											dataLog['user'] = "";
											dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
											this.stockManagement.addLogUser(id,dataLog);
										});
								});
							}
							this.hideLoader();
						}
				}).catch(error => {
					this.presentAlertFail();
				});
			});

	    this.preAddFromShow=true;
	  	this.showlist = false;
    	/*
    	3. add record stockopname (tanggal, brgMasuk) addStockopname(data)
    	4. update record stockopname (jumlahBarang)
    	*/
	}
	scanBarCode(index) {
      this.barcodeScanner.scan().then(barcodeData => {
          this.scannedBarCode[index] = barcodeData.text;
      }, (err) => {
          console.log('Error: ', err);
      });
    }

	async showAlert() {
    let alert = await this.alertController.create({
      header: 'Berhasil!',
    	message: 'Barang berhasil disimpan',
    });
    alert.present();
    setTimeout(()=>{
        alert.dismiss();
    }, 1000);
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
			this.statusError = '';
			if(this.selectedSumberBarang == "Barang Baru"){
				this.stockManagement.getIDStock(q).subscribe(data => {
					stocks = data.map(e => {
						return {
							 serialNumber: e.payload.doc.data()['serialNumber']
						};
					})
					if(stocks.length>0){
						if(stocks[0]['serialNumber'] == q){
							this.statusError = 'Barang sudah terdaftar';
							this.statusSucces = '';
							//this.sumbitDisabled = true;
						}
					}else{
							this.statusSucces = 'Barang belum terdaftar';
							this.statusError = '';
							//this.sumbitDisabled = false;
						}
				});
			}else if(this.selectedSumberBarang == "Agent Resign"){
				this.stockManagement.getIDStock(q).subscribe(data => {
					stocks = data.map(e => {
						return {
							 serialNumber: e.payload.doc.data()['serialNumber']
						};
					})
					if(stocks.length>0){
						if(stocks[0]['serialNumber'] == q){
							this.statusSucces = 'Barang ditemukan';
							this.statusError = '';
							//this.sumbitDisabled = false;
						}
					}else{
							this.statusError = 'Barang belum terdaftar';
							this.statusSucces = '';
							//this.sumbitDisabled = true;
						}
				});
			}
		}
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
			//this.showLoader("Mengirim data");
			this.preAddForm.reset();
			this.Barang = [];
			this.stockManagement.getDataBarang(this.selectedJenisBarang).get().then(snapshot => {
			console.log(snapshot.size);
			this.jml = snapshot.size;
			this.Barang.push(this.jmlBarang);

			let dataStockOpname = {};
			dataStockOpname['tanggal'] = Math.floor(new Date().getTime()/1000.0);
			dataStockOpname['barangKeluar'] = "";
			dataStockOpname['barangMasuk'] = this.jsonUpload.length;
			dataStockOpname['jenisBarang'] = this.selectedJenisBarang;
			dataStockOpname['keterangan'] = this.selectedSumberBarang;

			dataStockOpname['jmlBarang'] = this.jml + this.jsonUpload.length;
			console.log(dataStockOpname['jmlBarang']);
			this.stockManagement.addStockopname(dataStockOpname).then(resp => {
					let count = 0;
					if(this.selectedSumberBarang == "Barang Baru"){
						this.showLoader("Mengupload Data");
						for(let i=0; i<this.jsonUpload.length; i++){
							//1. prepare upload data stock (owner = "")
							let data = {};
							data['serialNumber'] = this.jsonUpload[i]['serialNumber'];;
							data['ownerBarang'] = "";
							data['jenisBarang'] = this.selectedJenisBarang;
							data['kondisiBarang'] = this.selectedKondisiBarang;
							data['statusBarang'] = "Available";
							data['createdAt'] = String(Math.floor(new Date().getTime()/1000.0));
							data['updatedAt'] = "";
							data['createdBy'] = this.userEmail;
							data['updatedBy'] = "";
							//2. upload data stock
							this.stockManagement.addStock(data).then(resp => {
								 console.log(i +" --> "+ this.jsonUpload[i]['serialNumber'])
								// //count = i;
								// if(i == this.jsonUpload-1){
								// 	this.hideLoader();
								// 	this.presentAlertSuccess();
								// }
							})
							.catch(error => {
									console.log(error);
							});
							//count = i;
						}
					}else if(this.selectedSumberBarang == "Agent Resign"){
						for(let i=0; i<this.jsonUpload.length; i++){
							//1. prepare upload data stock (owner = "")
							this.stockManagement.getIDBarang(this.jsonUpload[i]['serialNumber']).get()
								.then(snapshot => {
									this.tempArray = [];
									snapshot.forEach(e=> {
										this.tempArray.push(e.id);
										let id = e.id;
										let dataUpdate = {};
										//let data = {};
										dataUpdate['serialNumber'] = this.jsonUpload[i]['serialNumber'];
										dataUpdate['ownerBarang'] = "";
										dataUpdate['jenisBarang'] = this.selectedJenisBarang;
										dataUpdate['kondisiBarang'] = this.selectedKondisiBarang;
										dataUpdate['statusBarang'] = "Available";
										dataUpdate['createdAt'] = "";
										dataUpdate['updatedAt'] = Math.floor(new Date().getTime()/1000.0);
										dataUpdate['createdBy'] = "";
										dataUpdate['updatedBy'] = this.userEmail;
										//2. upload data stock
										this.stockManagement.updateStock(id, dataUpdate);
										let dataLog = {};
										dataLog['status'] = "Agent Resign";
										dataLog['user'] = "";
										dataLog['tanggal'] = Math.floor(new Date().getTime()/1000.0);
										this.stockManagement.addLogUser(id,dataLog);
									});

							});
							//count = i;
						}
					}
			}).catch(error => {
				this.hideLoader();
				this.presentAlertFail();
			});
		});
		//this.hideLoader();
		this.preAddFromShow=false;
		this.showuploadform = true;
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
}
