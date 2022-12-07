import { Component, OnInit } from '@angular/core';
import firebase from "firebase/compat/app";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {GamificationService} from "../../shared/gamification.service";

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
  collarItem: string;
  glassesItem: string;
  bowsItem: string;
  hatsItem: string;
  toysLeftItem: string;
  toysMiddleItem: string;
  toysRightItem: string;

  coins: number;
  levels: number;
  points: number;

  currentDate: any;
  currDate = new Date().toISOString()
  dayName: any;

  // List Mood
  Mood: any = [
    {moodID: 1, moodName: 'Unhappy', moodImg: 'assets/mood-icon/Unhappy.png'},
    {moodID: 2, moodName: 'Sad', moodImg: 'assets/mood-icon/Sad.png'},
    {moodID: 3, moodName: 'Neutral', moodImg: 'assets/mood-icon/Neutral.png'},
    {moodID: 4, moodName: 'Good', moodImg: 'assets/mood-icon/Good.png'},
    {moodID: 5, moodName: 'Happy', moodImg: 'assets/mood-icon/Happy.png'}
  ];

  // List Skins
  skinsList:
    { skin_id: string;
      skin_name: string;
      skin_price: number;
      skin_level: number;
      skin_img: string; }[];

  // List Houses
  housesList:
    { house_id: string;
      house_name: string;
      house_price: number;
      house_level: number;
      house_img: string; }[];

  // List Accessories
  accessoriesList:
    { acc_id: string;
      acc_name: string;
      acc_price: number;
      acc_level: number;
      acc_img: string; }[];

  // List Toys
  toysList:
    { toy_id: string;
      toy_name: string;
      toy_price: number;
      toy_level: number;
      toy_img: string; }[];

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private gamificationService: GamificationService
  ) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    //Get user's name from document field 'displayName'
    this.firestore.collection('users/').doc(this.userId).valueChanges().subscribe((res) => {
      this.displayName = res['displayName'].split(' ')[0]
    });

    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('appliedItems')
      .snapshotChanges().subscribe((res) => {
      this.skinItem = res.payload.data()['skins'][0].skin_id;
      this.houseItem = res.payload.data()['houses'][0].house_id;
      this.collarItem = res.payload.data()['accessories']['collar'].acc_id;
      this.glassesItem = res.payload.data()['accessories']['glasses'].acc_id;
      this.hatsItem = res.payload.data()['accessories']['pandora'].acc_id;
      this.bowsItem = res.payload.data()['accessories']['bow'].acc_id;
      this.toysLeftItem = res.payload.data()['toys']['left'].toy_id;
      this.toysMiddleItem = res.payload.data()['toys']['middle'].toy_id;
      this.toysRightItem = res.payload.data()['toys']['right'].toy_id;

      console.log(`
      Skin: ${this.skinItem}
      House: ${this.houseItem}
      Collar: ${this.collarItem}
      Glasses: ${this.glassesItem}
      Hats: ${this.hatsItem}
      Bows: ${this.bowsItem}
      Toys Left: ${this.toysLeftItem}
      Toys Middle: ${this.toysMiddleItem}
      Toys Right: ${this.toysRightItem}`);
    });

    //Get user gamification in gameData
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('gameData')
      .valueChanges()
      .subscribe((res) => {
        this.coins = res['coins'];
        this.levels = res['levels'];
        this.points = res['points'];

        console.log(`
          Coins: ${this.coins}
          Level: ${this.levels}
          Point: ${this.points}`);
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
              skin_img: e.payload.doc.data()['skin_img']
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
              house_img: e.payload.doc.data()['house_img']
            }
          })
        }
      })

    // Define Accessories data in firebase
    this.firestore
      .collection('gamification/')
      .doc('items/')
      .collection('items_acc/')
      .snapshotChanges()
      .subscribe(res=>{
        if(res){
          this.accessoriesList = res.map(e=>{
            return{
              acc_id: e.payload.doc.id,
              acc_name: e.payload.doc.data()['acc_name'],
              acc_price: e.payload.doc.data()['acc_price'],
              acc_level: e.payload.doc.data()['acc_level'],
              acc_img: e.payload.doc.data()['acc_img']
            }
          })
        }
      })

    // Define Toys data in firebase
    this.firestore
      .collection('gamification/')
      .doc('items/')
      .collection('items_toys/')
      .snapshotChanges()
      .subscribe(res=>{
        if(res){
          this.toysList = res.map(e=>{
            return{
              toy_id: e.payload.doc.id,
              toy_name: e.payload.doc.data()['toy_name'],
              toy_price: e.payload.doc.data()['toy_price'],
              toy_level: e.payload.doc.data()['toy_level'],
              toy_img: e.payload.doc.data()['toy_img']
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

  ionViewDidEnter() {
    this.gamificationService.UserLevelUp();
    console.log('ionViewDidEnter');
  }

  GoToAddMoodPage(){
    this.router.navigate(['/dashboard/add-mood']);
  }

  GoToBadgesPage() {
    this.router.navigate(['/dashboard/badges']);
  }
}
