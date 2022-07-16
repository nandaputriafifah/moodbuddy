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
  userId: any;
  date: string;
  maxDate: string;
  dateNumber: any;
  doc: any;
  totalMoodCount: any;
  addMood: {checkInDate: string, date: string; currentMood: string; currentFeeling: string; activities: string; notes: string };

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
    this.userId = firebase.auth().currentUser.uid;
    // Add [max] option in add-mood.page.html to disable input future date
    // Change format maxDate into yyyy-mm-dd ([max] option ONLY works in this date format)
    this.maxDate = new Date().toISOString().split('T')[0];
    console.log('THIS IS MAX DATE -->' + this.maxDate);
    this.addMood = {checkInDate: '', date: '', currentMood: '', currentFeeling: '', activities: '', notes: '' }

    // Get value moodCount in firebase and assign it to totalMoodCount
    this.firestore.collection('users/').doc(this.userId).valueChanges().subscribe(res=>{
      this.totalMoodCount = res['moodCount']
    })

    setTimeout(() => {
      // Get current date
      this.dateNumber = new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
    });
  }

  /** Function for add mood check-in to firebase */
  AddMood(date, currentMood, currentFeeling, activities, notes){
    let addMood = {}
    // addMood['checkInDate'] = new Date().toISOString().split('T')[0]
    addMood['date'] = date
    addMood['currentMood'] = currentMood
    addMood['currentFeeling'] = currentFeeling
    addMood['activities'] = activities
    addMood['notes'] = notes
    console.log(addMood)
      // Create new collection named 'moodCheckIn'
      // Firestore will create id for everytime user added mood
    this.firestore.collection('/users/').doc(this.userId).collection('moodCheckIn/').add(addMood).then(()=>{
        this.addMood = {checkInDate: '', date: '', currentMood: '', currentFeeling: '', activities: '', notes: ''}
        this.router.navigate(['/dashboard/tabs/journal']);
      })
  }

  /** Function for do sum everytime user add mood check-n*/
  SumMoodCount() {
    this.firestore.collection('/users/').doc(this.userId).update({
      moodCount: this.totalMoodCount + 1
    });
  }
}
