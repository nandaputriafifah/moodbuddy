import {Injectable, NgZone} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {User} from "./user";
import firebase from "firebase/compat/app";
import auth = firebase.auth;
import {Gamification} from "./gamification";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;
  userId: any;

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
        moodCount: 0
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
      moodCount: 0
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
      coins: 50,
      badges: {
        badge_id: '',
        // badge_name: '',
        // badge_reward: 0,
      },
      items: {
        houses: {
          house_id: 'h1_cardbox',
          // house_level: 1,
          // house_name: 'Card Box',
          // house_price: 0,
          // house_apply: true,
          // house_buy: true
        },
        skins: {
          skin_id: 's1_orange',
          // skin_level: 1,
          // skin_name: 'Orange',
          // skin_price: 0,
          // skin_apply: true,
          // skin_buy: true
        },
        accessories: {
          acc_id: '',
          // acc_level: 0,
          // acc_name: '',
          // acc_price: 0,
          // acc_apply: false,
          // acc_buy: false
        },
        toys: {
          toy_id: '',
          // toy_level: 0,
          // toy_name: '',
          // toy_price: 0,
          // toy_apply: false,
          // toy_buy: false
        }
      }
    };
    return userGamificationRef.set(userGamification);
  }

  // Sign-out
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
