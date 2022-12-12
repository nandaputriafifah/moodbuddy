import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {PopoverController} from "@ionic/angular";
import {Router} from "@angular/router";
import firebase from "firebase/compat/app";
import {ApplyitemsComponent} from "../applyitems/applyitems.component";

@Component({
  selector: 'app-buyitems',
  templateUrl: './buyitems.component.html',
  styleUrls: ['./buyitems.component.scss'],
})
export class BuyitemsComponent implements OnInit {
  userId: any;
  coins: number;
  levels: number;
  points: number;

  collarAppliedId: string;
  accOwnedId: string;
  accOwnedName: string;

  constructor(
    private firestore: AngularFirestore,
    private popoverController: PopoverController,
    private router: Router
  ) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('gameData')
      .snapshotChanges()
      .subscribe((res) => {
        this.coins = res.payload.data()['coins'];
        this.levels = res.payload.data()['levels'];
        this.points = res.payload.data()['points'];
        console.log(`
      Coins: ${this.coins}
      Level: ${this.levels}
      Point: ${this.points}`);
      });
  }

  dismiss() {
    this.popoverController.dismiss();
  }

  async presentPopoverApplyItems() {
    const popover = await this.popoverController.create({
      cssClass: 'apply-items',
      component: ApplyitemsComponent,
      backdropDismiss: false
    });
    return await popover.present();
  }

  BuyAccesory(accId, accName, accPrice, accExp) {
    if (this.coins >= accPrice) {
      this.firestore
        .collection('gamification/')
        .doc('items/')
        .collection('items_acc/')
        .doc(accId)
        .update({
          users:
            {
              [this.userId]:
                {
                  acc_apply: false,
                  acc_buy: true
                }
            }
        });

      this.firestore.collection('/users/')
        .doc(this.userId)
        .collection('userGamification/')
        .doc('ownedItems/')
        .collection('accessories')
        .doc(accId)
        .set({
          acc_name: accName,
          acc_apply: false,
          acc_buy: true
        });

      this.firestore.collection('/users/')
        .doc(this.userId)
        .collection('userGamification/')
        .doc('gameData')
        .update({
          coins: this.coins - accPrice,
          points: this.points + accExp
        });
    }
  }

}
