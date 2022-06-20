import { Component, OnInit } from '@angular/core';
import firebase from "firebase/compat/app";
import {AngularFirestore} from "@angular/fire/compat/firestore";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
  moodList: {moodId: string; date: string; currentMood: string; currentFeeling: string; activities: string; notes: string }[];

  constructor(private firestore: AngularFirestore) { }

  ngOnInit() {
    // Define user authentication
   firebase.auth().onAuthStateChanged((user) => {
      this.firestore.collection('users/').doc(user.uid).collection('moodCheckIn/').snapshotChanges().subscribe(res=>{
        if(res){
          this.moodList = res.map(e=>{
            return{
              moodId: e.payload.doc.id,
              date: e.payload.doc.data()['date'],
              currentMood: e.payload.doc.data()['currentMood'],
              currentFeeling: e.payload.doc.data()['currentFeeling'],
              activities: e.payload.doc.data()['activities'],
              notes: e.payload.doc.data()['notes']
            }
          })
        }
      })
    });
  }

}
