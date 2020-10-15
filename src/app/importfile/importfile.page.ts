import { Component, OnInit } from '@angular/core';
import { StockManagementService } from '../services/stock-management.service';
import { ModalController, NavParams, NavController, AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-importfile',
  templateUrl: './importfile.page.html',
  styleUrls: ['./importfile.page.scss'],
})
export class ImportfilePage implements OnInit {
  uploadedFile: any;
  jsonUpload: Array<any>;
  title: any;
  dataPre: any;
  userEmail: any;
  uploadButton: boolean = false;
  jenisBarang: any;
  preAddForm: FormGroup;
  selectedJenisBarang: any;
  jmlBarang: any;
  barang: any;
  loaderToShow: any;
  constructor(
    private stockManagement : StockManagementService,
    //private navParams: NavParams,
    private storage: Storage,
    private fb: FormBuilder,
    public alertController: AlertController,
    public loadingController: LoadingController
  ) {
    this.preAddForm = fb.group({
		    selectedJenisBarang: ['',Validators.compose([Validators.required])],
	  });
  }

  ngOnInit() {
    this.title = "Import File";
    //this.dataPre = this.navParams.data.dataForm;
    //console.log(this.dataPre);
    this.storage.get('username').then((val) => {
			this.userEmail = val;
		});
    this.stockManagement.readJenisBarang().get()
      .then(snapshot => {
        this.jenisBarang = [];
        snapshot.forEach(e=> {
          this.jenisBarang.push(e.data());
        });
    });
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
        this.selectedJenisBarang = this.preAddForm.controls["selectedJenisBarang"].value;
        this.jmlBarang = [];
        this.stockManagement.getDataBarang(this.selectedJenisBarang).get().then(data => {
  	      this.barang = data.size;
  	      //console.log(this.headset);
  	      this.jmlBarang.push(this.barang);
          });
        this.uploadButton = true;
        //console.log(this.jsonUpload);
      };
    }
  }
  uploadjson(){
    this.showLoader("Mengupload Data");
    for(let i=0; i<this.jsonUpload.length; i++){
      let data = {};
      data['serialNumber'] = this.jsonUpload[i]['serialNumber'];
      data['ownerBarang'] = this.jsonUpload[i]['ownerBarang'];
      data['jenisBarang'] = this.selectedJenisBarang;
      data['kondisiBarang'] = "Normal";
      data['statusBarang'] = this.jsonUpload[i]['statusBarang'];
      data['createdAt'] = String(Math.floor(new Date().getTime()/1000.0));
      data['updatedAt'] = "";
      data['createdBy'] = this.userEmail;
      data['updatedBy'] = "";
      //2. upload data stock
      //console.log(data);
      this.stockManagement.addStock(data).then(resp => {
      })
      .catch(error => {
          console.log(error);
      });
    }
    let dataStockOpname = {};
    dataStockOpname['tanggal'] = Math.floor(new Date().getTime()/1000.0);
    dataStockOpname['barangKeluar'] = "";
    dataStockOpname['barangMasuk'] = this.jsonUpload.length;
    dataStockOpname['jenisBarang'] = this.selectedJenisBarang;
    dataStockOpname['keterangan'] = "Barang Baru";
    dataStockOpname['jmlBarang'] = this.jmlBarang[0]+this.jsonUpload.length;
    //console.log(dataStockOpname);
    this.stockManagement.addStockopname(dataStockOpname).then(resp => {
      this.hideLoader();
      this.presentAlertSuccess();
    }).catch(error => {
      this.hideLoader();
        this.presentAlertFail();
    });

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
