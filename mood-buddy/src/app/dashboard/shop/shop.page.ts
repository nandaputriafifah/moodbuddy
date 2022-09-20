import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import firebase from "firebase/compat/app";

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
})
export class ShopPage implements OnInit {
  userId: any;
  displayName: string;

  skinItem: string;
  houseItem: string;
  coins: number;
  levels: number;
  points: number;

  currentDate: any;
  dayName: any;

  accList:
    { acc_id: string;
      acc_name: string;
      acc_price: number;
      acc_level: number;
      acc_exp: number;
      acc_img: string;
      acc_buy: boolean;
      acc_apply: boolean; }[];

  housesList:
    { house_id: string;
      house_name: string;
      house_price: number;
      house_level: number;
      house_exp: number;
      house_img: string;
      house_buy: boolean;
      house_apply: boolean; }[];

  skinsList:
    { skin_id: string;
      skin_name: string;
      skin_price: number;
      skin_level: number;
      skin_exp: number;
      skin_img: string;
      skin_buy: boolean;
      skin_apply: boolean; }[];

  toysList:
    { toy_id: string;
      toy_name: string;
      toy_price: number;
      toy_level: number;
      toy_exp: number;
      toy_img: string;
      toy_buy: boolean;
      toy_apply: boolean; }[];

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private modalController: ModalController) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    //Get user gamification in gameData
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('gameData')
      .valueChanges().subscribe((res) => {
      this.skinItem = res['items']['skins']['skin_id'];
      this.houseItem = res['items']['houses']['house_id'];
      this.coins = res['coins'];
      this.levels = res['levels'];
      this.points = res['points'];
      console.log(`
      Skin: ${this.skinItem}
      House: ${this.houseItem}
      Coins: ${this.coins}
      Level: ${this.levels}
      Point: ${this.points}`);
    });

    // Define accessories data in firebase
    this.firestore
      .collection('gamification/')
      .doc('items/')
      .collection('items_acc/')
      .snapshotChanges()
      .subscribe(res=>{
        if(res){
         this.accList = res.map(e=>{
            return{
              acc_id: e.payload.doc.id,
              acc_name: e.payload.doc.data()['acc_name'],
              acc_price: e.payload.doc.data()['acc_price'],
              acc_level: e.payload.doc.data()['acc_level'],
              acc_exp: e.payload.doc.data()['acc_exp'],
              acc_img: e.payload.doc.data()['acc_img'],
              acc_buy: e.payload.doc.data()['acc_buy'],
              acc_apply: e.payload.doc.data()['acc_apply']
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
              house_exp: e.payload.doc.data()['house_exp'],
              house_img: e.payload.doc.data()['house_img'],
              house_buy: e.payload.doc.data()['house_buy'],
              house_apply: e.payload.doc.data()['house_apply']
            }
          })
        }
      })

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
              skin_exp: e.payload.doc.data()['skin_exp'],
              skin_img: e.payload.doc.data()['skin_img'],
              skin_buy: e.payload.doc.data()['skin_buy'],
              skin_apply: e.payload.doc.data()['skin_apply']
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
              toy_exp: e.payload.doc.data()['toy_exp'],
              toy_img: e.payload.doc.data()['toy_img'],
              toy_buy: e.payload.doc.data()['toy_buy'],
              toy_apply: e.payload.doc.data()['toy_apply']
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

  GoToBadgesPage() {
    this.router.navigate(['/dashboard/badges']);
  }

}
