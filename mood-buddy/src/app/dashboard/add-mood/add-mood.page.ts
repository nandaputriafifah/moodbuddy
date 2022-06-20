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

  /** This is list of mood, feelings, activities that available for inputs**/
  // List mood
  Mood: any = [
    {moodID: 1, moodName: "Unhappy"},
    {moodID: 2, moodName: "Sad"},
    {moodID: 3, moodName: "Neutral"},
    {moodID: 4, moodName: "Good"},
    {moodID: 5, moodName: "Happy"}
  ]

  // List feelings
  Feelings: any = [
    {feelingID: 1, feelingName: "Joy"},
    {feelingID: 2, feelingName: "Sadness"},
    {feelingID: 3, feelingName: "Acceptance"},
    {feelingID: 4, feelingName: "Disgust"},
    {feelingID: 5, feelingName: "Fear"},
    {feelingID: 6, feelingName: "Anger"},
    {feelingID: 7, feelingName: "Surprised"},
    {feelingID: 8, feelingName: "Anticipation"}
  ]

  // List activities
  Activities: any = [
    {activitiesID: 1, activityName: "Work"},
    {activitiesID: 2, activityName: "Friends"},
    {activitiesID: 3, activityName: "Family"},
    {activitiesID: 4, activityName: "Love"},
    {activitiesID: 5, activityName: "Study"},
    {activitiesID: 6, activityName: "Travel"},
    {activitiesID: 7, activityName: "Shopping"},
    {activitiesID: 8, activityName: "Cleaning"},
    {activitiesID: 9, activityName: "Health"},
    {activitiesID: 10, activityName: "Pets"},
    {activitiesID: 11, activityName: "Gym"},
    {activitiesID: 12, activityName: "Movies"},
    {activitiesID: 13, activityName: "Music"},
    {activitiesID: 14, activityName: "Gaming"},
    {activitiesID: 15, activityName: "Party"},
    {activitiesID: 16, activityName: "Reading"},
    {activitiesID: 17, activityName: "Eating"},
    {activitiesID: 18, activityName: "Self-care"},
    {activitiesID: 19, activityName: "Time Alone"},
    {activitiesID: 20, activityName: "Helping Others"}
  ]

  constructor(
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  ngOnInit() {
    this.addMood = {date: '', currentMood: '', currentFeeling: '', activities: '', notes: '' }
    // Define user authentication
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

  // Function for add mood check-in to firebase
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
