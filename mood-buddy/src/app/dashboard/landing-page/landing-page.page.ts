import { Component, OnInit } from '@angular/core';
import firebase from "firebase/compat/app";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage implements OnInit {
  userId: any;
  displayName: string;
  skinItem: string;
  houseItem: string;
  moodName: any;
  currentDate: any;
  dayName: any;

  // List Mood
  Mood: any = [
    {moodID: 1, moodName: "Unhappy"},
    {moodID: 2, moodName: "Sad"},
    {moodID: 3, moodName: "Neutral"},
    {moodID: 4, moodName: "Good"},
    {moodID: 5, moodName: "Happy"}
  ]

  // List Skins
  skinsList:
    { skin_id: string;
      skin_name: string;
      skin_price: number;
      skin_level: number;
      skin_img: string;
      skin_buy: boolean;
      skin_apply: boolean; }[];

  // List Houses
  housesList:
    { house_id: string;
      house_name: string;
      house_price: number;
      house_level: number;
      house_img: string;
      house_buy: boolean;
      house_apply: boolean; }[];

  constructor(
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    //Get user's name from document field 'displayName'
    this.firestore.collection('users/').doc(this.userId).valueChanges().subscribe((res) => {
      this.displayName = res['displayName'].split(' ')[0]
    });

    //Get user's skin character in gameData
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('gameData')
      .valueChanges().subscribe((res) => {
        this.skinItem = res['items']['skins']['skin_id'];
      console.log(this.skinItem);
    });

    //Get user's house in gameData
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('gameData')
      .valueChanges().subscribe((res) => {
      this.houseItem = res['items']['houses']['house_id'];
      console.log(this.houseItem);
    });

    // Define Skins data in firebase
    this.firestore
      .collection('gamification/')
      .doc('items/')
      .collection('items_skins/')
      .snapshotChanges()
      .subscribe(res=>{
        if(res){
          this.skinsList = res.map(e=>{
            return{
              skin_id: e.payload.doc.id,
              skin_name: e.payload.doc.data()['skin_name'],
              skin_price: e.payload.doc.data()['skin_price'],
              skin_level: e.payload.doc.data()['skin_level'],
              skin_img: e.payload.doc.data()['skin_img'],
              skin_buy: e.payload.doc.data()['skin_buy'],
              skin_apply: e.payload.doc.data()['skin_apply']
            }
          })
        }
      })

    // Define Houses data in firebase
    this.firestore
      .collection('gamification/')
      .doc('items/')
      .collection('items_houses/')
      .snapshotChanges()
      .subscribe(res=>{
        if(res){
          this.housesList = res.map(e=>{
            return{
              house_id: e.payload.doc.id,
              house_name: e.payload.doc.data()['house_name'],
              house_price: e.payload.doc.data()['house_price'],
              house_level: e.payload.doc.data()['house_level'],
              house_img: e.payload.doc.data()['house_img'],
              house_buy: e.payload.doc.data()['house_buy'],
              house_apply: e.payload.doc.data()['house_apply']
            }
          })
        }
      })


    setTimeout(() => {
      // Get current date
      this.currentDate = new Date();
      // Get current day name
      this.dayName = new Date().toLocaleDateString('en-US', {weekday: "long"});
    });
  }

  GoToAddMoodPage(){
    this.router.navigate(['/dashboard/add-mood']);
  }
}
