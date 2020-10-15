import { Injectable } from '@angular/core';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class OrderManagementService {

  constructor( private firestore : AngularFirestore) { }

  addOrder(record) {
    return this.firestore.collection('peminjaman').add(record);
  }

  readOrder() {
    //return firebase.firestore().collection('stocks');
    return this.firestore.collection('peminjaman', ref=>ref
    														.where('status', 'in', ['Logged', 'Menyiapkan Barang', 'Barang Siap', 'Request Pengembalian', 'Terima Barang', 'Selesai'])
                                .where('createdAt', '>=', Math.floor(new Date().getTime()/1000.0) - 259200)
                                .where('createdAt', '<=', Math.floor(new Date().getTime()/1000.0))
                                .orderBy('createdAt', 'asc')).snapshotChanges();
  }
  readOrderUser(user) {
    //return firebase.firestore().collection('stocks');
    return this.firestore.collection('peminjaman', ref=>ref.where('namaPeminjam', '==', user)
    														.where('status', 'in', ['Logged', 'Menyiapkan Barang', 'Barang Siap', 'Terima Barang', 'Request Pengembalian'])
                                .where('createdAt', '>=', Math.floor(new Date().getTime()/1000.0) - 259200)
                                .where('createdAt', '<=', Math.floor(new Date().getTime()/1000.0))
                                .orderBy('createdAt', 'desc'))
    														.snapshotChanges();
  }

  readOrderbyInterval(start, end) {
    //return firebase.firestore().collection('stocks');
    return this.firestore.collection('peminjaman', ref=>ref.where('createdAt', '>=', start)
    														.where('createdAt', '<=', end)
    														.orderBy('createdAt', 'desc'))
    														.snapshotChanges();
  }
  readOrderUserbyInterval(user, start, end) {
    //return firebase.firestore().collection('stocks');
    return this.firestore.collection('peminjaman', ref=>ref.where('createdAt', '>=', start)
    														.where('createdAt', '<=', end)
                                .where('namaPeminjam', '==', user)
    														.orderBy('createdAt', 'desc'))
    														.snapshotChanges();
  }


  readListRequest(orderID) {
    return this.firestore.collection('peminjaman').doc(orderID).collection('listRequest').snapshotChanges();
  }
  addListRequest(orderID, record) {
  	return this.firestore.collection('peminjaman/' + orderID + "/listRequest").add(record);
  }

  updateOrder(recordID,record){
    this.firestore.doc('peminjaman/' + recordID).update(record);
  }

  deleteOrder(record_id) {
    //this.firestore.doc('stocks/' + record_id).delete();
  }
  addListBarang(idOrder, data){
  	return this.firestore.collection('peminjaman/' + idOrder + '/listBarang/').add(data);
  }
  getListPinjam(idOrder){
  	  	return this.firestore.collection('peminjaman/' + idOrder + '/listBarang/').snapshotChanges();
  }
  getListBarangPinjam(idOrder){
        //return this.firestore.collection('peminjaman/' + idOrder + '/listBarang/');
        return firebase.firestore().collection('peminjaman/' + idOrder + '/listBarang/');
  }
  readStatusOrder() {
    return firebase.firestore().collection('statusOrder');
  }
  getOrderByStatus(status){
  	 return  firebase.firestore().collection('peminjaman').where('status', '==', status).where('createdAt', '>=', Math.floor(new Date().getTime()/1000.0) - 259200)
     .where('createdAt', '<=', Math.floor(new Date().getTime()/1000.0));
  }
  getOrderByUserStatus(user, status){
  	 return  firebase.firestore().collection('peminjaman').where('namaPeminjam', '==', user).where('status', '==', status).where('createdAt', '>=', Math.floor(new Date().getTime()/1000.0) - 259200)
     .where('createdAt', '<=', Math.floor(new Date().getTime()/1000.0));
  }
  getOrderByMultipleStatus(status){
  	 return this.firestore.collection('peminjaman', ref=>ref.where('status', 'in', status).where('createdAt', '>=', Math.floor(new Date().getTime()/1000.0) - 259200)
     .where('createdAt', '<=', Math.floor(new Date().getTime()/1000.0))).snapshotChanges();
  }
  getOrderByMultipleUserStatus(user, status){
  	 return this.firestore.collection('peminjaman', ref=>ref.where('status', 'in', status)
                                                            .where('namaPeminjam', '==', user).where('createdAt', '>=', Math.floor(new Date().getTime()/1000.0) - 259200)
                                                            .where('createdAt', '<=', Math.floor(new Date().getTime()/1000.0))).snapshotChanges();
  }
  addLogOrder(orderID, record) {
  	return this.firestore.collection('peminjaman/' + orderID + "/logStatus").add(record);
  }
  getLogStatus(id){
    return this.firestore.collection('peminjaman').doc(id).collection('logStatus', ref => ref.orderBy('tanggal', 'asc')).snapshotChanges();
  }
}
