import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat/app";

@Component({
  selector: 'app-badges',
  templateUrl: './badges.page.html',
  styleUrls: ['./badges.page.scss'],
})
export class BadgesPage implements OnInit {
  userId: any;

  skinsOwned: any = [];
  housesOwned: any = [];
  toysOwned: any = [];
  accessoriesOwned: any = [];

  badgesList:
    { badge_id: string;
      badge_name: string;
      badge_reward: number;
      badge_exp: number;
      badge_img: string;
      badge_desc: string;
      badge_claim: boolean;
      badge_count: number; }[];

  constructor(
    private firestore: AngularFirestore
  ) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    // Define badges data in firebase
    this.firestore
      .collection('gamification/')
      .doc('badges/')
      .collection('badges_list/', ref => ref.orderBy('badge_count', 'asc'))
      .snapshotChanges()
      .subscribe(res=>{
        if(res){
          this.badgesList = res.map(e=>{
            return{
              badge_id: e.payload.doc.id,
              badge_name: e.payload.doc.data()['badge_name'],
              badge_desc: e.payload.doc.data()['badge_desc'],
              badge_reward: e.payload.doc.data()['badge_reward'],
              badge_exp: e.payload.doc.data()['badge_exp'],
              badge_img: e.payload.doc.data()['badge_img'],
              badge_claim: e.payload.doc.data()['badge_claim'],
              badge_count: e.payload.doc.data()['badge_count']
            }
          })
        }
      })

    // Get owned skins
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('skins')
      .get()
      .subscribe(res => {
        res.forEach((snap) => {
          this.skinsOwned.push(snap.id);
          console.log(this.skinsOwned);
        });
      });

    // Get owned houses
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('houses')
      .get()
      .subscribe(res => {
        res.forEach((snap) => {
          this.housesOwned.push(snap.id);
          console.log(this.housesOwned);
        });
      });

    // Get owned accessories
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('accessories')
      .get()
      .subscribe(res => {
        res.forEach((snap) => {
          this.accessoriesOwned.push(snap.id);
          console.log(this.accessoriesOwned);
        });
      });

    // Get owned toys
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('toys')
      .get()
      .subscribe(res => {
        res.forEach((snap) => {
          if (snap.data()['toy_buy'] == true) {
            this.toysOwned.push(snap.id);
            console.log(this.toysOwned);
          }
        });
      });
  }
}
