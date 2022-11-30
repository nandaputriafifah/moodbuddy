import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {ModalController} from "@ionic/angular";
import firebase from "firebase/compat/app";
import {DatePipe} from "@angular/common";
import {CalendarComponent} from "ionic2-calendar";

@Component({
  selector: 'app-updatemood',
  templateUrl: './updatemood.component.html',
  styleUrls: ['./updatemood.component.scss'],
})
export class UpdatemoodComponent implements OnInit {
  @Input() eventId: string;
  @Input() id: string;
  @Input() date: string;
  @Input() currentMood: string;
  @Input() currentFeeling: string;
  @Input() activities: string;
  @Input() notes: string;

  tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  currDate = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);
  maxDate: string;

  checkedFeelings:any;
  checkedActivity:any;

  //Calendar
  viewTitle: string;
  selectedDate = new Date();
  eventSource: [];

  calendar = {
    mode: "month",
    currentDate: new Date(),
  };

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

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
    {feelingID: 1, feelingName: 'Joy', isChecked: false},
    {feelingID: 2, feelingName: 'Sadness', isChecked: false},
    {feelingID: 3, feelingName: 'Acceptance', isChecked: false},
    {feelingID: 4, feelingName: 'Disgust', isChecked: false},
    {feelingID: 5, feelingName: 'Fear', isChecked: false},
    {feelingID: 6, feelingName: 'Anger', isChecked: false},
    {feelingID: 7, feelingName: 'Surprised', isChecked: false},
    {feelingID: 8, feelingName: 'Anticipation', isChecked: false}
  ];

  // List activities
  Activities: any = [
    {activitiesID: 1, activityName: 'Work', activityImg: 'assets/activities-icon/Work.png', isChecked: false},
    {activitiesID: 2, activityName: 'Friends', activityImg: 'assets/activities-icon/Friends.png', isChecked: false},
    {activitiesID: 3, activityName: 'Family', activityImg: 'assets/activities-icon/Family.png',isChecked: false},
    {activitiesID: 4, activityName: 'Love', activityImg: 'assets/activities-icon/Love.png',isChecked: false},
    {activitiesID: 5, activityName: 'Study', activityImg: 'assets/activities-icon/Study.png',isChecked: false},
    {activitiesID: 6, activityName: 'Travel', activityImg: 'assets/activities-icon/Travel.png',isChecked: false},
    {activitiesID: 7, activityName: 'Shopping', activityImg: 'assets/activities-icon/Shopping.png',isChecked: false},
    {activitiesID: 8, activityName: 'Cleaning', activityImg: 'assets/activities-icon/Cleaning.png',isChecked: false},
    {activitiesID: 9, activityName: 'Health', activityImg: 'assets/activities-icon/Health.png',isChecked: false},
    {activitiesID: 10, activityName: 'Pets', activityImg: 'assets/activities-icon/Pets.png',isChecked: false},
    {activitiesID: 11, activityName: 'Gym', activityImg: 'assets/activities-icon/Gym.png',isChecked: false},
    {activitiesID: 12, activityName: 'Movies', activityImg: 'assets/activities-icon/Movies.png',isChecked: false},
    {activitiesID: 13, activityName: 'Music', activityImg: 'assets/activities-icon/Music.png',isChecked: false},
    {activitiesID: 14, activityName: 'Gaming', activityImg: 'assets/activities-icon/Gaming.png',isChecked: false},
    {activitiesID: 15, activityName: 'Party', activityImg: 'assets/activities-icon/Party.png',isChecked: false},
    {activitiesID: 16, activityName: 'Reading', activityImg: 'assets/activities-icon/Reading.png',isChecked: false},
    {activitiesID: 17, activityName: 'Eating', activityImg: 'assets/activities-icon/Eating.png',isChecked: false},
    {activitiesID: 18, activityName: 'Self-care',activityImg: 'assets/activities-icon/Self-care.png', isChecked: false},
    {activitiesID: 19, activityName: 'Time Alone', activityImg: 'assets/activities-icon/Time Alone.png',isChecked: false},
    {activitiesID: 20, activityName: 'Helping Others', activityImg: 'assets/activities-icon/Helping Others.png',isChecked: false}
  ];

  constructor(
    private firestore: AngularFirestore,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    // Add [max] option in updatemood.component.html to disable input future date
    // maxDate is current date
    this.maxDate = this.currDate;
    console.log(this.eventId);

    //Get value checked (check box) for currentFeeling
    for (let i = 0; i < this.currentFeeling.length; i += 1) {
      //Divide the array of feelings into chunk
      // Ex: before ['Joy', 'Sadness'] -> after ['Joys'], ['Sadness']
      let sliceArrayFeelings = this.currentFeeling.slice(i, i + 1);
      console.log(sliceArrayFeelings);

      // Change value 'true' for 'isCheck' for each feeling that is checked
      for (let i = 0; i < this.Feelings.length; i++) {
        if (this.Feelings[i].feelingName == sliceArrayFeelings.toString()) {
          this.Feelings[i].isChecked = true;
          console.log(this.Feelings);
        }
      }
    }

    //Get value checked (check box) for activities
    for (let i = 0; i < this.activities.length; i += 1) {
      //Divide the array of activities into chunk
      // Ex: before ['Eating', 'Gym'] -> after ['Eating'], ['Gym']
      let sliceArrayActivities = this.activities.slice(i, i + 1);
      console.log(sliceArrayActivities);

      // Change value 'true' for 'isCheck' for each activity that is checked
      for (let i = 0; i < this.Activities.length; i++) {
        if (this.Activities[i].activityName == sliceArrayActivities.toString()) {
          this.Activities[i].isChecked = true;
          console.log(this.Activities);
        }
      }
    }
  }

  UpdateMood(date, currentMood, currentFeeling, activities, notes){
    let updateMood = {};
    let arrayFeelings = [];
    let arrayActivities = [];

    // Calendar
    const start = this.selectedDate;
    const end = this.selectedDate;
    end.setMinutes(end.getMinutes() + 60);

    // event object created to include semi-random title
    const event = {
      title: currentMood,
      startTime: new Date(date),
      endTime: new Date(date),
      allDay: false,
    };

    this.checkedFeelings =  this.Feelings.filter(value => {
      return value.isChecked;
    });

    this.checkedActivity =  this.Activities.filter(value => {
      return value.isChecked;
    });

    for (let i = 0; i < this.checkedFeelings.length; i++) {
      arrayFeelings.push(this.checkedFeelings[i].feelingName);
      console.log(arrayFeelings);
    }

    for (let i = 0; i < this.checkedActivity.length; i++) {
      arrayActivities.push(this.checkedActivity[i].activityName);
      console.log(arrayActivities);
    }

      updateMood['currentDate'] = this.currDate
      updateMood['date'] = date
      updateMood['currentMood'] = currentMood
      updateMood['currentFeeling'] = arrayFeelings
      updateMood['activities'] = arrayActivities
      updateMood['notes'] = notes

      firebase.auth().onAuthStateChanged((user) => {
        this.firestore.collection('users/').doc(user.uid).collection('moodCheckIn/').doc(this.id).update(updateMood).then(()=>{
          this.firestore.collection('/users/').doc(user.uid).collection('event/').doc(this.eventId).update(event);
          this.modalController.dismiss()
        })
      });
  }

  CloseModal(){
    this.modalController.dismiss()
  }
}
