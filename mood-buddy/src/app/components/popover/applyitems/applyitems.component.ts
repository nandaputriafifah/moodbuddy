import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {PopoverController} from "@ionic/angular";
import {Router} from "@angular/router";
import firebase from "firebase/compat/app";
import {CompletepageComponent} from "../completepage/completepage.component";

@Component({
  selector: 'app-applyitems',
  templateUrl: './applyitems.component.html',
  styleUrls: ['./applyitems.component.scss'],
})
export class ApplyitemsComponent implements OnInit {
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

  ApplyAccessory(accId) {
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('appliedItems')
      .snapshotChanges()
      .subscribe( res => {
        this.collarAppliedId = res.payload.data()['accessories']['collar']['acc_id'];
        console.log(this.collarAppliedId);


        if (accId.split('_')[1] == 'collar') {
          if(this.collarAppliedId) {
            this.firestore
              .collection('gamification/')
              .doc('items/')
              .collection('items_acc/')
              .doc(this.collarAppliedId)
              .update({
                users:
                  {
                    [this.userId]:
                      {
                        acc_apply: true,
                        acc_buy: true
                      }
                  }
              })
          }
        }
      });

    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('accessories')
      .get()
      .subscribe(res => {
        res.forEach((snap) => {
          this.accOwnedId = snap.id;
          this.accOwnedName = snap.data()['acc_name'];
          console.log('Acc Owned ID: ' + this.accOwnedId);

          if (this.accOwnedId !== accId && accId.split('_')[1] == 'collar') {
            this.firestore
              .collection('gamification/')
              .doc('items/')
              .collection('items_acc/')
              .doc(this.accOwnedId)
              .update({
                users:
                  {
                    [this.userId]:
                      {
                        acc_apply: false,
                        acc_buy: true
                      }
                  }
              })

            this.firestore.collection('/users/')
              .doc(this.userId)
              .collection('userGamification/')
              .doc('ownedItems/')
              .collection('accessories')
              .doc(this.accOwnedId)
              .set({
                acc_name: this.accOwnedName,
                acc_apply: false,
                acc_buy: true
              });
          }
        });
      });

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
                acc_apply: true,
                acc_buy: true
              }
          }
      })

    if (accId.split('_')[1] == 'collar') {
      this.firestore.collection('/users/')
        .doc(this.userId)
        .collection('userGamification/')
        .doc('appliedItems')
        .set({
          accessories: {
            collar: {
              acc_id: accId,
              acc_apply: true,
              acc_buy: true,
            }
          }
        }, {merge: true});
    }

    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('accessories')
      .doc(accId)
      .update({
        acc_apply: true
      });
  }

  async presentCompleteTutorial() {
    const popover = await this.popoverController.create({
      cssClass: 'complete-page',
      component: CompletepageComponent,
      backdropDismiss: false
    });
    return await popover.present();
  }
}
