import { Injectable } from '@angular/core';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class StockManagementService {
	tempArray : Array<any>;

  constructor(
  	private firestore : AngularFirestore
  ) { }
  addStock(record) {
    return this.firestore.collection('stocks').add(record);
  }

  readStock() {
    //return firebase.firestore().collection('stocks');
    return this.firestore.collection('stocks', ref=>ref.orderBy("statusBarang", "asc")).snapshotChanges();
  }
  readStockDedicated() {
    //return firebase.firestore().collection('stocks');
    return this.firestore.collection('stocks', ref=>ref.where('statusBarang', 'in', ['Dedicated', 'Dipakai'])).snapshotChanges();
  }
  readStockNonDedicated() {
    //return firebase.firestore().collection('stocks');
    return this.firestore.collection('stocks', ref=>ref.where('statusBarang', 'in', ['Available', 'Dipinjam'])).snapshotChanges();
  }

  updateStock(recordID,record){
    this.firestore.doc('stocks/' + recordID).update(record);
  }

  deleteStock(record_id) {
    this.firestore.doc('stocks/' + record_id).delete();
  }
  getIDStock(serialNumber){
  	 return this.firestore.collection('stocks', ref=>ref.where('serialNumber', '==', serialNumber)).snapshotChanges();
  }

  search(serialNumber){
  	 return this.firestore.collection('stocks', ref=>ref.where('serialNumber', '==', serialNumber)).get();
  }
  getByID(idBarang){
  	 return this.firestore.collection('stocks').doc(idBarang).snapshotChanges();
  }
  getIDBarang(serialNumber){
  	 return firebase.firestore().collection('stocks').where('serialNumber', '==', serialNumber);
  }

  setStockStatus(id, status){
  	let data = {};
  	data['statusBarang'] = status;
		this.firestore.doc('stocks/' + id).update(data);
  }

  readJenisBarang() {
    return firebase.firestore().collection('jenisBarang');
  }
  readKondisiBarang() {
    return firebase.firestore().collection('kondisiBarang');
  }
  readStatusBarang() {
    return firebase.firestore().collection('statusBarang');
  }
  readOpsiBarangMasuk() {
    return firebase.firestore().collection('opsiBarangMasuk');
  }
  readOpsiBarangKeluar() {
    return firebase.firestore().collection('opsiBarangKeluar');
  }
  stockOpname(start, end, jenisBarang) {
    //return firebase.firestore().collection('stocks');
    return this.firestore.collection('stockOpname', ref=>ref.where('jenisBarang', '==', jenisBarang)
                                .where('tanggal', '>=', start)
    														.where('tanggal', '<=', end)
    														.orderBy('tanggal', 'asc')).snapshotChanges();
  }
  addStockopname(record) {
    return this.firestore.collection('stockOpname').add(record);
  }
  updateStockOpname(recordID,record){
    this.firestore.doc('stockOpname/' + recordID).update(record);
  }

  getDataBarang(jenisBarang){
  	return firebase.firestore().collection('stocks').where('jenisBarang', '==', jenisBarang).where('statusBarang', 'in', ['Available', 'Dipinjam']);
  }
  getDataBarangByJenisBarang(jenisBarang) {
    //return firebase.firestore().collection('stocks');
    return this.firestore.collection('stocks', ref=>ref.where('jenisBarang', '==', jenisBarang)).snapshotChanges();
  }
  getLogUser(id){
    return this.firestore.collection('stocks').doc(id).collection('logUser', ref=>ref.orderBy('tanggal', 'asc')).snapshotChanges();
  }
  addLogUser(stockID, record) {
  	return this.firestore.collection('stocks/' + stockID + '/logUser').add(record);
  }

}
