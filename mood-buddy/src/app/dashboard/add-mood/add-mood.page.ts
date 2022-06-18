import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from "firebase/compat/app";
import {Router} from "@angular/router";


@Component({
  selector: 'app-add-mood',
  templateUrl: './add-mood.page.html',
  styleUrls: ['./add-mood.page.scss'],
})
export class AddMoodPage implements OnInit {
  date: string;
  dateNumber: any;
  doc: any;
  moodList: {moodId: string; date: string; currentMood: string; currentFeeling: string; activities: string; notes: string }[];
  addMood: {date: string; currentMood: string; currentFeeling: string; activities: string; notes: string };


  constructor(
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit() {
    this.addMood = {date: '', currentMood: '', currentFeeling: '', activities: '', notes: '' }
    // Define auth
    firebase.auth().onAuthStateChanged((user) => {
      this.firestore.collection('users/').snapshotChanges().subscribe(res=>{
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
    setTimeout(() => {
      // Get current date
      this.dateNumber = new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
      // // Get today's day name
      // this.day = new Date().toLocaleString('en-us', {weekday:'long'});
      // // Get today's month name
      // this.month = new Date().toLocaleString('en-us',{ month: 'long' });
    });
  }

  AddMood(date, currentMood, currentFeeling, activities, notes){
    let addMood = {}
    addMood['date'] = date
    addMood['currentMood'] = currentMood
    addMood['currentFeeling'] = currentFeeling
    addMood['activities'] = activities
    addMood['notes'] = notes
    console.log(addMood)
    firebase.auth().onAuthStateChanged((user) => {
      // Create new collection named 'moodCheckIn'
      // Firestore will create id for everytime user added mood
      this.firestore.collection('/users/').doc(user.uid).collection('moodCheckIn/').add(addMood).then(()=>{
        this.addMood = {date: '', currentMood: '', currentFeeling: '', activities: '', notes: ''}
        this.router.navigate(['/dashboard/tabs/landing-page']);
      })
    });
  }
}
