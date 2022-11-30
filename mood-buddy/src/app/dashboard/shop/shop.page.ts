import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {LoadingController, ModalController} from "@ionic/angular";
import firebase from "firebase/compat/app";
import {GamificationService} from "../../shared/gamification.service";

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

  skinAppliedId: string;
  skinOwnedId: string;
  skinOwnedName: string;
  skinBuy: boolean;
  skinId: string;

  houseAppliedId: string;
  houseOwnedId: string;
  houseOwnedName: string;

  currentDate: any;
  dayName: any;

  accList:
    { acc_id: string;
      acc_name: string;
      acc_price: number;
      acc_level: number;
      acc_exp: number;
      acc_img: string; }[];

  housesList:
    { house_id: string;
      house_name: string;
      house_price: number;
      house_level: number;
      house_exp: number;
      house_img: string;
      users:
        {
          house_apply: boolean;
          house_buy: boolean;
        }
    }[];

  skinsList:
    { skin_id: string;
      skin_name: string;
      skin_price: number;
      skin_level: number;
      skin_exp: number;
      skin_img: string;
      users:
        {
          skin_apply: boolean;
          skin_buy: boolean;
        }
    }[];

  toysList:
    { toy_id: string;
      toy_name: string;
      toy_price: number;
      toy_level: number;
      toy_exp: number;
      toy_img: string; }[];

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private modalController: ModalController,
    private loadingCtrl: LoadingController,
    private gamificationService: GamificationService
  ) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    //Get user gamification in gameData
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
              users: {
                house_apply: e.payload.doc.data()['users'][this.userId]['house_apply'],
                house_buy: e.payload.doc.data()['users'][this.userId]['house_buy']
              }
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
            console.log('SKIN APPLY =======');
            // console.log(e.payload.doc.data()['users'][this.userId]['skin_apply']);
            // console.log(e.payload.doc.data()['users'][this.userId]['skin_apply']);
            return{
              skin_id: e.payload.doc.id,
              skin_name: e.payload.doc.data()['skin_name'],
              skin_price: e.payload.doc.data()['skin_price'],
              skin_level: e.payload.doc.data()['skin_level'],
              skin_exp: e.payload.doc.data()['skin_exp'],
              skin_img: e.payload.doc.data()['skin_img'],
              users: {
                skin_apply: e.payload.doc.data()['users'][this.userId]['skin_apply'],
                skin_buy: e.payload.doc.data()['users'][this.userId]['skin_buy']
              }
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

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Dismissing after 3 seconds...',
      duration: 3000,
    });

    loading.present();
  }

  GoToBadgesPage() {
    this.router.navigate(['/dashboard/badges']);
  }

  BuySkin(skinId, skinName, skinPrice) {
    console.log('Coin: '+ this.coins);
    console.log('Skin Price: '+ skinPrice);

    if (this.coins >= skinPrice) {
      this.firestore
        .collection('gamification/')
        .doc('items/')
        .collection('items_skins/')
        .doc(skinId)
        .update({
          users:
            {
              [this.userId]:
                {
                  skin_apply: false,
                  skin_buy: true
                }
            }
        })

      this.firestore.collection('/users/')
        .doc(this.userId)
        .collection('userGamification/')
        .doc('ownedItems/')
        .collection('skins')
        .doc(skinId)
        .set({
          skin_name: skinName,
          skin_apply: false,
          skin_buy: true
        });

      // let remainingCoins;
      // remainingCoins = this.coins - skinPrice;

      this.firestore.collection('/users/')
        .doc(this.userId)
        .collection('userGamification/')
        .doc('gameData')
        .update({
          coins: this.coins - skinPrice
        });
    }
  }

  ApplySkin(skinId) {
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('appliedItems')
      .snapshotChanges()
      .subscribe( res => {
        this.skinAppliedId = res.payload.data()['skins'][0]['skin_id'];
        console.log(this.skinAppliedId);

        this.firestore
          .collection('gamification/')
          .doc('items/')
          .collection('items_skins/')
          .doc(this.skinAppliedId)
          .update({
            users:
              {
                [this.userId]:
                  {
                    skin_apply: true,
                    skin_buy: true
                  }
              }
          })
      });

    console.log('2' + this.skinAppliedId);
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('skins')
      .get()
      .subscribe(res => {
        res.forEach((snap) => {
          this.skinOwnedId = snap.id;
          this.skinOwnedName = snap.data()['skin_name'];
          console.log('Skin Owned ID' + this.skinOwnedId);
          console.log('Skin Owned NAME' + this.skinOwnedName);

          if (this.skinOwnedId !== skinId) {
            this.firestore
              .collection('gamification/')
              .doc('items/')
              .collection('items_skins/')
              .doc(this.skinOwnedId)
              .update({
                users:
                  {
                    [this.userId]:
                      {
                        skin_apply: false,
                        skin_buy: true
                      }
                  }
              })

            this.firestore.collection('/users/')
              .doc(this.userId)
              .collection('userGamification/')
              .doc('ownedItems/')
              .collection('skins')
              .doc(this.skinOwnedId)
              .set({
                skin_name: this.skinOwnedName,
                skin_apply: false,
                skin_buy: true
              });
          }
        });
      });

    this.firestore
      .collection('gamification/')
      .doc('items/')
      .collection('items_skins/')
      .doc(skinId)
      .update({
        users:
          {
            [this.userId]:
              {
                skin_apply: true,
                skin_buy: true
              }
          }
      })

    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('appliedItems')
      .update({
        skins: [
          { skin_id: skinId,
            skin_apply: true,
            skin_buy: true,
          }
        ]
      });

    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('skins')
      .doc(skinId)
      .update({
        skin_apply: true
      });
  }

  BuyHouse (houseId, houseName, housePrice) {
    console.log('Coin: '+ this.coins);
    console.log('House Price: '+ housePrice);

    if (this.coins >= housePrice) {
      this.firestore
        .collection('gamification/')
        .doc('items/')
        .collection('items_houses/')
        .doc(houseId)
        .update({
          users:
            {
              [this.userId]:
                {
                  house_apply: false,
                  house_buy: true
                }
            }
        })

      this.firestore.collection('/users/')
        .doc(this.userId)
        .collection('userGamification/')
        .doc('ownedItems/')
        .collection('houses')
        .doc(houseId)
        .set({
          house_name: houseName,
          house_apply: false,
          house_buy: true
        });

      this.firestore.collection('/users/')
        .doc(this.userId)
        .collection('userGamification/')
        .doc('gameData')
        .update({
          coins: this.coins - housePrice
        });
    }
  }

  ApplyHouse (houseId) {
    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('appliedItems')
      .snapshotChanges()
      .subscribe( res => {
        this.houseAppliedId = res.payload.data()['houses'][0]['house_id'];
        console.log(this.houseAppliedId);

        this.firestore
          .collection('gamification/')
          .doc('items/')
          .collection('items_houses/')
          .doc(this.houseAppliedId)
          .update({
            users:
              {
                [this.userId]:
                  {
                    house_apply: true,
                    house_buy: true
                  }
              }
          })
      });

    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('houses')
      .get()
      .subscribe(res => {
        res.forEach((snap) => {
          this.houseOwnedId = snap.id;
          this.houseOwnedName = snap.data()['house_name'];
          console.log('House Owned ID' + this.houseOwnedId);
          console.log('House Owned NAME' + this.houseOwnedName);

          if (this.houseOwnedId !== houseId) {
            this.firestore
              .collection('gamification/')
              .doc('items/')
              .collection('items_houses/')
              .doc(this.houseOwnedId)
              .update({
                users:
                  {
                    [this.userId]:
                      {
                        house_apply: false,
                        house_buy: true
                      }
                  }
              })

            this.firestore.collection('/users/')
              .doc(this.userId)
              .collection('userGamification/')
              .doc('ownedItems/')
              .collection('houses')
              .doc(this.houseOwnedId)
              .set({
                house_name: this.houseOwnedName,
                house_apply: false,
                house_buy: true
              });
          }
        });
      });

    this.firestore
      .collection('gamification/')
      .doc('items/')
      .collection('items_houses/')
      .doc(houseId)
      .update({
        users:
          {
            [this.userId]:
              {
                house_apply: true,
                house_buy: true
              }
          }
      })

    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('appliedItems')
      .update({
        houses: [
          { house_id: houseId,
            house_apply: true,
            house_buy: true,
          }
        ]
      });

    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('houses')
      .doc(houseId)
      .update({
        house_apply: true
      });
  }
}
