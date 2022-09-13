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

  badgesList:
    { badge_id: string;
      badge_name: string;
      badge_reward: number;
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
      .collection('badges_list/')
      .snapshotChanges()
      .subscribe(res=>{
        if(res){
          this.badgesList = res.map(e=>{
            return{
              badge_id: e.payload.doc.id,
              badge_name: e.payload.doc.data()['badge_name'],
              badge_desc: e.payload.doc.data()['badge_desc'],
              badge_reward: e.payload.doc.data()['badge_reward'],
              badge_img: e.payload.doc.data()['badge_img'],
              badge_claim: e.payload.doc.data()['badge_claim'],
              badge_count: e.payload.doc.data()['badge_count']
            }
          })
        }
      })
  }

}
