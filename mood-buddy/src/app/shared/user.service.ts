import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, AngularFireObject} from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userListRef: AngularFireList<any>;
  userRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {
  }
  //
  // // Add mood check-in
  // addMood(: Appointment) {
  //   return this.bookingListRef.push({
  //     name: apt.name,
  //     email: apt.email,
  //     mobile: apt.mobile,
  //   });
  // }
}
