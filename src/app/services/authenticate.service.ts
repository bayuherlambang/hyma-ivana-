import { Injectable } from '@angular/core';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(public storage : Storage) { }

  registerUser(value){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
     .then(
     	res => {
        	let userId = firebase.auth().currentUser.uid;
        	let userDoc = firebase.firestore().doc('users/' + userId);
        	userDoc.set({
        		firstname: value.fname,
        		lastname: value.lname,
          		email: value.email,
          		isadmin: false
        	});
        	resolve(res)
        	},
      	err => reject(err)
     )
   })
  }
  loginUser(value){
   return new Promise<any>((resolve, reject) => {
     firebase.auth().signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err)
       )
   })
  }
  logoutUser(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        firebase.auth().signOut()
        .then(() => {
            this.storage.set('isLogged', 0);
            this.storage.clear();
          //console.log("LOG Out");
          resolve();
        }).catch((error) => {
          reject();
        });
      }
    })
  }
  userDetails(){
    return firebase.auth().currentUser;
  }
  isAdmin(){
  	let result;
    let userId = firebase.auth().currentUser.uid;
  	return firebase.firestore().doc('users/' + userId).get().then(function (doc) {
          if (doc.exists)
          	return doc.data().isadmin;
          	return Promise.reject("No such document");
    });
  }
  getRole(){
  	let result;
    let userId = firebase.auth().currentUser.uid;
  	return firebase.firestore().doc('users/' + userId).get().then(function (doc) {
          if (doc.exists)
          	return doc.data().role;
          	return Promise.reject("No such document");
    });
  }
}
