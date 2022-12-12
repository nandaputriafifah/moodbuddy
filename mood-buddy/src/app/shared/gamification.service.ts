import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import firebase from "firebase/compat/app";
import {AlertController, LoadingController, PopoverController} from "@ionic/angular";
import {LandingPagePage} from "../dashboard/landing-page/landing-page.page";
import {PopoverComponent} from "../components/popover/popover.component";

@Injectable({
  providedIn: 'root'
})
export class GamificationService {
  userId: any;
  points: number;
  coins: number;
  levels: number;

  checkInId: number;
  checkInDate: any;
  checkInNameReward: any;
  checkInClaim: boolean;
  checkInReward: number;

  dateCheckIn = [];

  checkInId2: number;
  checkInDate2: any;
  checkInNameReward2: any;
  checkInClaim2: boolean;
  checkInReward2: number;

  idDailyReward: string;

  imgClickUrl: string;

  tutorial: boolean;

  tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  currDate = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);

  tomorrow;
  tomorrowDay;
  tomorrowMonth;
  tomorrowYear;
  tomorrowDate;

  // tomorrowDay = (new Date(Date.now() - this.tzoffset + 1)).toDateString().split(' ')[2];
  // tomorrowMonth = (new Date(Date.now() - this.tzoffset + 1)).getMonth() + 1;
  // tomorrowYear = (new Date(Date.now() - this.tzoffset + 1)).getFullYear();
  // tomorrowDate = `${this.tomorrowYear}-${this.tomorrowMonth}-${this.tomorrowDay}`;

  public alertPresented: any;

  constructor(
    private firestore: AngularFirestore,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    public popoverController: PopoverController
  ) {
    this.userId = firebase.auth().currentUser.uid;
    this.alertPresented = false;
    this.imgClickUrl = 'assets/click.gif';
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

  showDailyReward() {
    this.firestore
      .collection('/users/')
      .doc(this.userId)
      .collection('userDailyReward/')
      .doc(this.currDate.split('T')[0])
      .get()
      .subscribe(res => {
        this.checkInId = res.data()['reward_id'];
        this.checkInDate = res.data()['date_reward'];
        this.checkInNameReward = res.data()['name_reward'];
        this.checkInReward = res.data()['reward_coins'];
        this.checkInClaim = res.data()['claim_reward'];

        if (this.currDate.split('T')[0] == this.checkInDate &&
          this.checkInClaim == false) {
          this.presentAlertDailyReward(this.checkInReward);
        }
      });

    this.firestore
      .collection('/users/')
      .doc(this.userId)
      .collection('userDailyReward/')
      .get()
      .subscribe((res) => {
        res.forEach((snap) => {
          this.dateCheckIn.push(snap.data()['date_reward']);
          this.checkInDate2 = snap.data()['date_reward'];
          this.checkInClaim2 = snap.data()['claim_reward'];
          console.log(this.dateCheckIn);
          console.log(`${this.currDate.split('T')[0]} !== ${this.dateCheckIn[1]}`);

          // if (parseInt(this.currDate.split('T')[0].split('-')[2], 10) > parseInt(this.dateCheckIn[1].split('-')[2], 10) &&
          //   this.dateCheckIn[1] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //
          //   // this.firestore
          //   //   .collection('/users/')
          //   //   .doc(this.userId)
          //   //   .collection('userDailyReward/')
          //   //   .doc(this.checkInDate2)
          //   //   .set({
          //   //     reward_id: 1,
          //   //     name_reward: `Cekidot`,
          //   //     date_reward: this.checkInDate2,
          //   //     reward_coins: 100,
          //   //     claim_reward: false
          //   //   });
          //   // this.createNewDailyReward(this.checkInDate2);
          // }
          // if (this.currDate.split('T')[0] !== this.dateCheckIn[2] &&
          //   this.dateCheckIn[2] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //   // this.createNewDailyReward(this.checkInDate2);
          // }
          // if (this.currDate.split('T')[0] !== this.dateCheckIn[3] &&
          //   this.dateCheckIn[3] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //   // this.createNewDailyReward(this.checkInDate2);
          // }
          // if (this.currDate.split('T')[0] !== this.dateCheckIn[4] &&
          //   this.dateCheckIn[4] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //   // this.createNewDailyReward(this.checkInDate2);
          // }
          // if (this.currDate.split('T')[0] !== this.dateCheckIn[5] &&
          //   this.dateCheckIn[5] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //   // this.createNewDailyReward(this.checkInDate2);
          // }
          // if (this.currDate.split('T')[0] !== this.dateCheckIn[6] &&
          //   this.dateCheckIn[6] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //   // this.createNewDailyReward(this.checkInDate2);
          // }

          // if (this.currDate.split('T')[0] !== this.dateCheckIn[1] &&
          //   this.dateCheckIn[1] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[0])
          //     .update({
          //       claim_reward: true
          //     })
          // }
          // if (this.currDate.split('T')[0] !== this.dateCheckIn[2] &&
          //   this.dateCheckIn[2] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[0])
          //     .update({
          //       claim_reward: true
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[1])
          //     .update({
          //       claim_reward: false
          //     })
          // }
          // if (this.currDate.split('T')[0] !== this.dateCheckIn[3] &&
          //   this.dateCheckIn[3] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[0])
          //     .update({
          //       claim_reward: true
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[1])
          //     .update({
          //       claim_reward: false
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[2])
          //     .update({
          //       claim_reward: false
          //     })
          // }
          // if (this.currDate.split('T')[0] !== this.dateCheckIn[4] &&
          //   this.dateCheckIn[4] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[0])
          //     .update({
          //       claim_reward: true
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[1])
          //     .update({
          //       claim_reward: false
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[2])
          //     .update({
          //       claim_reward: false
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[3])
          //     .update({
          //       claim_reward: false
          //     })
          // }
          // if (this.currDate.split('T')[0] !== this.dateCheckIn[5] &&
          //   this.dateCheckIn[5] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[0])
          //     .update({
          //       claim_reward: true
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[1])
          //     .update({
          //       claim_reward: false
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[2])
          //     .update({
          //       claim_reward: false
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[3])
          //     .update({
          //       claim_reward: false
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[4])
          //     .update({
          //       claim_reward: false
          //     })
          // }
          // if (this.currDate.split('T')[0] !== this.dateCheckIn[6] &&
          //   this.dateCheckIn[6] == this.checkInDate2 &&
          //   this.checkInClaim2 == false ) {
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[0])
          //     .update({
          //       claim_reward: true
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[1])
          //     .update({
          //       claim_reward: false
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[2])
          //     .update({
          //       claim_reward: false
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[3])
          //     .update({
          //       claim_reward: false
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[4])
          //     .update({
          //       claim_reward: false
          //     })
          //
          //   this.firestore
          //     .collection('/users/')
          //     .doc(this.userId)
          //     .collection('userDailyReward/')
          //     .doc(this.dateCheckIn[5])
          //     .update({
          //       claim_reward: false
          //     })
          // }
        });
      });
  }

  claimDailyReward(reward) {
    this.firestore
      .collection('/users/')
      .doc(this.userId)
      .collection('userDailyReward/')
      .doc(this.currDate.split('T')[0])
      .update({
        claim_reward: true
      });

    this.firestore.collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('gameData')
      .get()
      .subscribe((res) => {
        console.log('coins ' + res.data()['coins']);
        console.log('reward ' + reward);

        this.firestore.collection('/users/')
          .doc(this.userId)
          .collection('userGamification/')
          .doc('gameData')
          .update({
            coins: res.data()['coins'] + reward
          });
      });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 2000,
    });

    loading.present();
  }

  async presentAlertDailyReward(reward) {
    const alert = await this.alertController.create({
      header: 'Congratulations!',
      subHeader: `You got + ${reward}!`,
      buttons: [
        {
          text: 'CLAIM',
          role: 'confirm',
          handler: () => {
            console.log('CLAIM Clicked');
            this.showLoading().then(() => {
              this.claimDailyReward(reward);
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async presentAlertTutorial() {
    const alert = await this.alertController.create({
      cssClass: 'alert-tutorial',
      header: 'Hello, My name is Buddy',
      subHeader: `Let's be friend!`,
      backdropDismiss: false,
      mode: 'ios',
      animated: true,
      buttons: [
        {
          text: 'Start',
          handler: () => {
            this.presentAlertTutorial1();
            console.log('Start Clicked');
          },
        },
      ],
    });
    await alert.present();
  }

  async presentAlertTutorial1() {
    const alert = await this.alertController.create({
      cssClass: 'alert-tutorial',
      header: 'Let\'s tell Buddy!',
      subHeader: `Click add button to record your mood.`,
      backdropDismiss: true,
      mode: 'ios',
      animated: true,
      buttons: [
        {
          text: 'OK',
          cssClass: 'alert-button-cancel',
          handler: () => {
            console.log('OK Clicked');
            this.presentAlertTutorial2();
          },
        },
      ],
    });
    await alert.present();
  }

  async presentAlertTutorial2() {
    const alert = await this.alertController.create({
      cssClass: 'click-alert-tutorial',
      message: `<img src="${this.imgClickUrl}"
                       style="width: 30%">`,
      mode: 'ios',
      animated: true,
    });
    await alert.present();
  }

  updateTutorial() {
    this.firestore
      .collection('users/')
      .doc(this.userId)
      .update({
        showTutorial: false
      });
  };

  showTutorial() {
    this.firestore
      .collection('users/')
      .doc(this.userId)
      .get()
      .subscribe((res) => {
      this.tutorial = res.data()['showTutorial'];

      if (this.tutorial == true) {
        this.presentAlertTutorial();
      }
    });
  }
}
