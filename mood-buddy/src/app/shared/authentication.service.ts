import {Injectable, NgZone} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {User} from "./user";
import firebase from "firebase/compat/app";
import auth = firebase.auth;
import {Gamification} from "./gamification";
import {CheckIn} from "./check-in";
import {Items} from "./items";
import {DailyRewards} from "./daily-rewards";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;
  userId: any;

  skinId: any;
  houseId: any;
  accId: any;
  toyId: any;

  tomorrow;
  tomorrowDay;
  tomorrowMonth;
  tomorrowYear;
  tomorrowDate;

  tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  currDate = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.ngFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Login in with email/password
  SignIn(email, password) {
    return this.ngFireAuth.signInWithEmailAndPassword(email, password);
  }

  // Register user with email, password, name
  RegisterUser(email, password, name) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password).then((result) => {
      const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
        `users/${result.user.uid}`
      );
      // Inserting data to firestore database
      const userData: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        emailVerified: result.user.emailVerified,
        moodCount: 0,
        showTutorial: true
      };
      return userRef.set(userData, {
        merge: true,
      });
    }).catch((error) => {
      window.alert(error);
    });
  }

  // Email verification when new user register
  SendVerificationMail() {
    return firebase.auth().currentUser.sendEmailVerification()
    // return this.ngFireAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.SetUserGamification();
        this.SetUserOwnedItems();
        this.SetUserAppliedItems();
        this.SetUserGamificationItems();
        this.SetDailyReward();
        this.createNextDailyReward();
        this.SetUserMoodCheckInCounter();
        this.router.navigate(['verify-email']);
      })
  }
  // Recover password
  PasswordRecover(passwordResetEmail) {
    return this.ngFireAuth
      .sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert(
          'Password reset email has been sent, please check your inbox.'
        );
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null && user.emailVerified !== false ? true : false;
  }
  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.emailVerified !== false ? true : false;
  }

  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Auth providers
  AuthLogin(provider) {
    return this.ngFireAuth
      .signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard/tabs/landing-page']);
        });
        // Firebase will capture creationTime and lastSignInTime everytime user log in with Google.
        // creationTime equal to lastSignInTime means user is log in with Google for the FIRST time, and
        // the database should write user data using function SetUserData(user).
        // If user already log in with Google before, database should NOT write user data again.
        // This condition prohibit database to overwrite value 'moodCount' in SetUserData whenever user log in with Google.
        if (result.user.metadata.creationTime == result.user.metadata.lastSignInTime) {
          this.SetUserData(result.user);
          this.SetUserGamification();
          this.SetUserOwnedItems();
          this.SetUserAppliedItems();
          this.SetUserGamificationItems();
          this.SetDailyReward();
          this.createNextDailyReward();
          this.SetUserMoodCheckInCounter();
        }
        console.log(result.user.metadata);
        console.log(`Creation Time: ${result.user.metadata.creationTime}`);
        console.log(`Last Sign In Time: ${result.user.metadata.lastSignInTime}`);
      })
      .catch((error) => {
        window.alert(error);
      });
  }

  // Store user in localStorage
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      emailVerified: user.emailVerified,
      moodCount: 0,
      showTutorial: true
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Add user's gamification data in firebase
  SetUserGamification(){
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;

    const userGamificationRef: AngularFirestoreDocument<any> = this.afStore
      .collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('gameData')

    const userGamification: Gamification = {
      levels: 1,
      points: 0,
      coins: 0,
      badges: {
        badge_id: '',
        // badge_name: '',
        // badge_reward: 0,
      }
    };
    return userGamificationRef.set(userGamification);
  }

  SetSkinsItems() {
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;

    const userOwnedItemsRef: AngularFirestoreDocument<any> = this.afStore
      .collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('skins')
      .doc('s1_orange')

    return userOwnedItemsRef.set({
      skin_name: 'Orange',
      skin_apply: true,
      skin_buy: true
    });
  }

  SetHousesItems() {
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;

    const userOwnedItemsRef: AngularFirestoreDocument<any> = this.afStore
      .collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('houses')
      .doc('h1_cardbox')

    return userOwnedItemsRef.set({
      house_name: 'Card Box',
      house_apply: true,
      house_buy: true
    });
  }

  SetAccessoriesItems() {
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;

    const userOwnedItemsRef: AngularFirestoreDocument<any> = this.afStore
      .collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('accessories')
      .doc('acc1_collar')

    return userOwnedItemsRef.set({
      acc_name: 'Basic Collar',
      acc_apply: true,
      acc_buy: true
    });
  }

  SetToysItems() {
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;

    const userOwnedItemsRef: AngularFirestoreDocument<any> = this.afStore
      .collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('ownedItems/')
      .collection('toys')
      .doc('t1_bone')

    return userOwnedItemsRef.set({
      toy_name: 'Bone',
      toy_apply: false,
      toy_buy: false
    });
  }

  SetUserOwnedItems() {
   this.SetSkinsItems();
   this.SetHousesItems();
   this.SetAccessoriesItems();
   this.SetToysItems();
  }

  SetSkinGamification() {
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;

    this.afStore
      .collection('gamification/')
      .doc('items/')
      .collection('items_skins/')
      .get()
      .subscribe((res) => {
        res.forEach((snap) => {
          this.skinId = snap.id;

          const setSkinGamificationRef: AngularFirestoreDocument<any> = this.afStore
            .collection('gamification/')
            .doc('items/')
            .collection('items_skins/')
            .doc(this.skinId)

          if (this.skinId == 's1_orange') {
            return setSkinGamificationRef.set({
              users:
                {
                  [this.userId]:
                    {
                      skin_apply: true,
                      skin_buy: true
                    }
                }
            }, {merge: true});
          }

          return setSkinGamificationRef.set({
            users:
              {
                [this.userId]:
                  {
                    skin_apply: false,
                    skin_buy: false
                  }
              }
          }, {merge: true});
        });
      });
  }

  SetHouseGamification() {
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;

    this.afStore
      .collection('gamification/')
      .doc('items/')
      .collection('items_houses/')
      .get()
      .subscribe((res) => {
        res.forEach((snap) => {
          this.houseId = snap.id;

          const setHouseGamificationRef: AngularFirestoreDocument<any> = this.afStore
            .collection('gamification/')
            .doc('items/')
            .collection('items_houses/')
            .doc(this.houseId)

          if (this.houseId == 'h1_cardbox') {
            return setHouseGamificationRef.set({
              users:
                {
                  [this.userId]:
                    {
                      house_apply: true,
                      house_buy: true
                    }
                }
            }, {merge: true});
          }

          return setHouseGamificationRef.set({
            users:
              {
                [this.userId]:
                  {
                    house_apply: false,
                    house_buy: false
                  }
              }
          }, {merge: true});
        });
      });
  }

  SetAccessoriesGamification() {
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;

    this.afStore
      .collection('gamification/')
      .doc('items/')
      .collection('items_acc/')
      .get()
      .subscribe((res) => {
        res.forEach((snap) => {
          this.accId = snap.id;

          const setAccessoriesGamificationRef: AngularFirestoreDocument<any> = this.afStore
            .collection('gamification/')
            .doc('items/')
            .collection('items_acc/')
            .doc(this.accId)

          if (this.accId == 'acc1_collar') {
            return setAccessoriesGamificationRef.set({
              users:
                {
                  [this.userId]:
                    {
                      acc_apply: true,
                      acc_buy: true
                    }
                }
            }, {merge: true});
          }

          return setAccessoriesGamificationRef.set({
            users:
              {
                [this.userId]:
                  {
                    acc_apply: false,
                    acc_buy: false
                  }
              }
          }, {merge: true});
        });
      });
  }

  SetToysGamification() {
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;

    this.afStore
      .collection('gamification/')
      .doc('items/')
      .collection('items_toys/')
      .get()
      .subscribe((res) => {
        res.forEach((snap) => {
          this.toyId = snap.id;

          const setToysGamificationRef: AngularFirestoreDocument<any> = this.afStore
            .collection('gamification/')
            .doc('items/')
            .collection('items_toys/')
            .doc(this.toyId)

          return setToysGamificationRef.set({
            users:
              {
                [this.userId]:
                  {
                    toy_apply: false,
                    toy_buy: false
                  }
              }
          }, {merge: true});
        });
      });
  }

  SetUserGamificationItems() {
    this.SetSkinGamification();
    this.SetHouseGamification();
    this.SetAccessoriesGamification();
    this.SetToysGamification();
  }

  SetUserAppliedItems(){
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;

    const userAppliedItemsRef: AngularFirestoreDocument<any> = this.afStore
      .collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('appliedItems')

    const userAppliedItems: Items = {
      houses: [
        { house_id: 'h1_cardbox',
          house_apply: true,
          house_buy: true,
        }
      ],
      skins: [
        { skin_id: 's1_orange',
          skin_apply: true,
          skin_buy: true,
        }
      ],
      accessories:
        {  collar:
            {
              acc_id: 'acc1_collar',
              acc_apply: true,
              acc_buy: true
            },
          glasses:
            {
              acc_id: '',
              acc_apply: false,
              acc_buy: false
            },
          pandora:
            {
              acc_id: '',
              acc_apply: false,
              acc_buy: false
            },
          bow:
            {
              acc_id: '',
              acc_apply: false,
              acc_buy: false
            },
        },
      toys:  {
        left:
          {
            toy_id: '',
            toy_apply: false,
            toy_buy: false
          },
        middle:
          {
            toy_id: '',
            toy_apply: false,
            toy_buy: false
          },
        right:
          {
            toy_id: '',
            toy_apply: false,
            toy_buy: false
          },
      },
    };
    return userAppliedItemsRef.set(userAppliedItems);
  }

  SetDailyReward() {
    this.userId = firebase.auth().currentUser.uid;
    const userDailyRewardRef: AngularFirestoreDocument<any> = this.afStore
      .collection('/users/')
      .doc(this.userId)
      .collection('userDailyReward/')
      .doc(this.currDate.split('T')[0])

    const userDailyReward: DailyRewards = {
      reward_id: 1,
      name_reward: 'Day 1',
      date_reward: this.currDate.split('T')[0],
      reward_coins: 100,
      claim_reward: false
    };
    return userDailyRewardRef.set(userDailyReward);
  }

  createNextDailyReward () {
    for (let i = 1; i < 7; i++) {
      this.tomorrow = new Date(Date.now()).toLocaleDateString();
      this.tomorrowDay = parseInt(this.tomorrow.split('/')[1], 10) + i;
      this.tomorrowMonth = this.tomorrow.split('/')[0];
      this.tomorrowYear = this.tomorrow.split('/')[2];
      this.tomorrowDate = `${this.tomorrowYear}-${this.tomorrowMonth}-${this.tomorrowDay}`;

      console.log('TOMORROW DATE: ' + this.tomorrowDate);

      this.afStore
        .collection('/users/')
        .doc(this.userId)
        .collection('userDailyReward/')
        .doc(this.tomorrowDate)
        .set({
          reward_id: 1 + i,
          name_reward: `Day ${1 + i}`,
          date_reward: this.tomorrowDate,
          reward_coins: 100 + (i * 25),
          claim_reward: false
        }, {merge: true});
    }
  }

  SetUserMoodCheckInCounter(){
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;
    const userMoodCheckInCounterRef: AngularFirestoreDocument<any> = this.afStore
      .collection('/users/')
      .doc(this.userId)
      .collection('userCheckInCounter/')
      .doc(this.currDate.split('T')[0])

    const userCheckInCounter: CheckIn = {
      // date: this.currDate,
      counter: 0,
      counterFlag: false
    };
    return userMoodCheckInCounterRef.set(userCheckInCounter);
  }

  // Sign-out
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
