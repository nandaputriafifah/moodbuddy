import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import firebase from "firebase/compat/app";
import {AlertController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  userId: any;
  points: number;
  coins: number;
  levels: number;
  public alertPresented: any;

  constructor(
    private firestore: AngularFirestore,
    private alertController: AlertController,
  ) {
    this.userId = firebase.auth().currentUser.uid;
    this.alertPresented = false;
  }

  UserLevelUp () {
    this.firestore.collection('users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('gameData')
      .get().subscribe(res =>{
      this.points = res.data()['points'];
      this.coins = res.data()['coins'];
      this.levels = res.data()['levels'];

      if (this.points >= 500 && this.points <= 1499) {
        // this.levels+=Math.floor(this.points/500);
        // console.log(this.levels);
        // this.points = this.points%500;
        console.log('UPDATE: ' + this.points);
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 2
          });
      }

      if (this.points >= 1500 && this.points <= 2999) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 3
          })
      }

      if (this.points >= 3000 && this.points <= 4999) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 4
          })
      }

      if (this.points >= 5000 && this.points <= 7499) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 5
          })
      }

      if (this.points >= 7500 && this.points <= 10499) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 6
          })
      }

      if (this.points >= 10500 && this.points <= 13999) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 7
          })
      }

      if (this.points >= 14000 && this.points <= 17999) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 8
          })
      }

      if (this.points >= 18000 && this.points <= 22499) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 9
          })
      }

      if (this.points >= 22500 && this.points <= 27499) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 10
          })
      }

      if (this.points >= 27500 && this.points <= 32999) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 11
          })
      }

      if (this.points >= 33000 && this.points <= 38999) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 12
          })
      }

      if (this.points >= 39000 && this.points <= 45499) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 13
          })
      }

      if (this.points >= 45500 && this.points <= 52499) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 14
          })
      }

      if (this.points >= 52500 && this.points <= 59999) {
        this.firestore.collection('users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            levels: 15
          })
      }
    })
    // this.presentAlert();
    // console.log('Alert: ' + this.alertPresented);
  }

  async presentAlert() {
    if (!this.alertPresented) {
      this.alertPresented = true;
      const alert = await this.alertController.create({
        header: 'Level UP!',
        buttons: [
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
              console.log('OK Clicked');
              console.log('Alert Presented: ' + this.alertPresented);
            },
          },
        ],
      });
      await alert.present();
      this.alertPresented = false
    }

    // const { role } = await alert.onDidDismiss();
    // this.roleMessage = `Dismissed with role: ${role}`;
  }
}
