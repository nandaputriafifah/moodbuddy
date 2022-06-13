import {Injectable, NgZone} from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument} from "@angular/fire/compat/firestore";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";
import {User} from "./user";
import firebase from "firebase/compat/app";
import auth = firebase.auth;
import {error} from "protractor";
import {user} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;
  userId: any;
  userEmail: any;

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
  // Register user with email, password, name, username
  RegisterUser(email, password, name, username) {
    return this.ngFireAuth.createUserWithEmailAndPassword(email, password).then((result) => {
      const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
        `users/${result.user.uid}`
      );
      const userData: User = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: name,
        emailVerified: result.user.emailVerified,
      };
      return userRef.set(userData, {
        merge: true,
      });

      // this.SetUserData(result.user);
      // console.log(result);
    }).catch((error) => {
      window.alert(error);
    });
    // return this.ngFireAuth.createUserWithEmailAndPassword(email, password).then((user) => {
    //   if (user) {
    //     console.log(user);
    //     this.userId = user['user'].uid;
    //     this.userEmail = user['user'].email;
    //
    //     // Inserting into database
    //     firebase.database().ref('users/' + this.userId).set({
    //         displayName: name,
    //         displayUsername: username,
    //         displayEmail: email
    //     },(error) => {
    //       if (error) {
    //         console.log(error);
    //       } else {
    //         console.log('New User Saved');
    //       }
    //     });
    //   }
    //   return user;
    // }).catch((error) => {
    //   // Handle Errors here.
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   console.log(errorMessage);
    //   return errorMessage;
    // });
  }

  // Email verification when new user register
  SendVerificationMail() {
    return firebase.auth().currentUser.sendEmailVerification()
    // return this.ngFireAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
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
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
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
    };
    return userRef.set(userData, {
      merge: true,
    });
  }
  // Sign-out
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }
}
