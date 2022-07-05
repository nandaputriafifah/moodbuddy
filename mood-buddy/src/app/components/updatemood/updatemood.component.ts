import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ModalController} from "@ionic/angular";
import firebase from "firebase/compat/app";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-updatemood',
  templateUrl: './updatemood.component.html',
  styleUrls: ['./updatemood.component.scss'],
})
export class UpdatemoodComponent implements OnInit {
  @Input() id: string;
  @Input() date: string;
  @Input() currentMood: string;
  @Input() currentFeeling: string;
  @Input() activities: string;
  @Input() notes: string;

  dateValue: string;
  maxDate: string;


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
    private modalController: ModalController
  ) { }

  ngOnInit() {
    // Add [max] option in updatemood.component.html to disable input future date
    // Change format maxDate into yyyy-mm-dd ([max] option ONLY works in this date format)
    this.maxDate = new Date().toISOString().split('T')[0];
    console.log('THIS IS MAX DATE -->' + this.maxDate);
  }

  UpdateMood(date, currentMood, currentFeeling, activities, notes){
    let updateMood = {}
    updateMood['date'] = date,
      updateMood['currentMood'] = currentMood,
      updateMood['currentFeeling'] = currentFeeling,
      updateMood['activities'] = activities,
      updateMood['notes'] = notes,
      firebase.auth().onAuthStateChanged((user) => {
        this.firestore.collection('users/').doc(user.uid).collection('moodCheckIn/').doc(this.id).update(updateMood).then(()=>{
          this.modalController.dismiss()
        })
      });
  }

  CloseModal(){
    this.modalController.dismiss()
  }

}
