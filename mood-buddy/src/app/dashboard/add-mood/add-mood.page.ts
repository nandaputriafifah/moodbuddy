import {Component, OnInit, ViewChild} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from "firebase/compat/app";
import {Router} from "@angular/router";
import {CalendarComponent} from "ionic2-calendar";


@Component({
  selector: 'app-add-mood',
  templateUrl: './add-mood.page.html',
  styleUrls: ['./add-mood.page.scss'],
})
export class AddMoodPage implements OnInit {
  userId: any;
  maxDate: string;

  tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  currDate = (new Date(Date.now() - this.tzoffset)).toISOString().slice(0, -1);
  doc: any;

  moodCountLength: any;
  totalMoodCount: number = 0;
  totalCounts = [];

  addedPoint = [];
  previousPoint = [];
  addedCoin = [];
  previousCoin = [];

  // points = 0;
  // coins = 0;
  // totalPoints: any;
  // totalCoins: any;

  addMood: {currentDate: string; date: string; currentMood: string; currentFeeling: string; activities: string; notes: string };

  // Calendar
  eventSource = [];
  viewTitle: string;

  calendar = {
    mode: "month",
    currentDate: new Date(),
  };

  selectedDate = new Date();

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
    // Get current user id
    this.userId = firebase.auth().currentUser.uid;

    // Add [max] option in add-mood.page.html to disable input future date
    // maxDate is current date
    this.maxDate = this.currDate;

    this.addMood = {currentDate: '', date: '', currentMood: '', currentFeeling: '', activities: '', notes: '' }

    // Get value moodCount in firebase and assign it to totalMoodCount
    this.firestore.collection('users/').doc(this.userId).valueChanges().subscribe(res=>{
      this.totalMoodCount = res['moodCount']
    })

    // Set mood check-in count
    // This is for counting whenever user do check-in
    // Also important for calculation to indicate the limit of getting points & coins
    // this.firestore
    //   .collection('/users/')
    //   .doc(this.userId)
    //   .collection('checkInCounts/')
    //   .doc(this.currDate.split('T')[0])
    //   .set({
    //     count: 0
    //   });
  }

  /** Function for add mood check-in to firebase */
  AddMood(date, currentMood, currentFeeling, activities, notes){
    let addMood = {}

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
    }

    addMood['currentDate'] = this.currDate
    addMood['date'] = date
    addMood['currentMood'] = currentMood
    addMood['currentFeeling'] = currentFeeling
    addMood['activities'] = activities
    addMood['notes'] = notes

      // Create new collection named 'moodCheckIn'
      // Firestore will create id for everytime user added mood
    this.firestore.collection('/users/').doc(this.userId).collection('moodCheckIn/').add(addMood).then(()=>{
      this.addMood = {currentDate: '', date: '', currentMood: '', currentFeeling: '', activities: '', notes: ''}
      this.router.navigate(['/dashboard/tabs/journal']);
      })

    this.firestore.collection('/users/').doc(this.userId).collection('event/').add(event);

    this.previousPoint = [];
    this.previousCoin = [];

    // Get value points & coins in gameData
    this.firestore.collection('users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('gameData')
      .snapshotChanges().subscribe(res =>{
      this.previousPoint.push(res.payload.data()['points']);
      this.previousCoin.push(res.payload.data()['coins']);
      return [this.previousPoint, this.previousCoin];
      // this.totalPoints = res['points']
      // this.totalCoins = res['coins']
      // return this.totalPoints;
    })

    console.log(this.previousPoint);
    console.log(this.previousCoin);

    // Whenever user input the same date as current date, count will be added
    // Also important for calculation to indicate the limit of getting points & coins
    this.firestore
      .collection('users/')
      .doc(this.userId)
      .collection('moodCheckIn/')
      .snapshotChanges()
      .subscribe(res=>{
        this.totalCounts = [];
        this.addedPoint = [];
        res.forEach((val) => {
          this.moodCountLength = val.payload.doc.data()['date'].split('T')[0];
          if (this.moodCountLength == this.currDate.split('T')[0]) {
            // Push into arrays to get the length of the same date as current date
            this.totalCounts.push(this.moodCountLength);
            console.log(this.totalCounts);
          }

          // Points & coins will be added,
          // if the current date as same as the date input, AND total counts <= 2
          /** LENGTH MASIH ERROR**/
          if (this.currDate.split('T')[0] == date.split('T')[0] && this.totalCounts.length <= 2){
            this.SumMoodCount();
          }
        })
        console.log('LENGTH: ' + this.totalCounts.length);
      })


    // Get value of count in checkInCounts
    // this.firestore
    //   .collection('/users/')
    //   .doc(this.userId)
    //   .collection('checkInCounts/')
    //   .doc(this.currDate.split('T')[0])
    //   .snapshotChanges().subscribe(res => {
    //   this.totalCounts = res.payload.data()['count'];
    // });

    // Everytime user input the same date as current date, count will be added
    // this.firestore
    //   .collection('/users/')
    //   .doc(this.userId)
    //   .collection('moodCheckIn/')
    //   .snapshotChanges().subscribe(res=>{
    //   res.forEach((val) => {
    //     // console.log(val['date'].split('T')[0]);
    //     if (val.payload.doc.data()['date'].split('T')[0] == this.currDate.split('T')[0]){
    //       this.firestore
    //         .collection('/users/')
    //         .doc(this.userId)
    //         .collection('checkInCounts/')
    //         .doc(this.currDate.split('T')[0])
    //         .update({
    //           count: this.totalCounts++
    //         })
    //       console.log('TOTAL COUNTS: ' + this.totalCounts);
    //     }
    //   });
    // })
  }

  SumMoodCount() {
    this.addedPoint.push(25);
    this.addedCoin.push(500);

    let calcuPoint = this.addedPoint.reduce((accum, a) => accum + a, 0)
    let calcuCoin= this.addedCoin.reduce((accum, a) => accum + a, 0)

    console.log('ADDED POINT: ' + this.addedPoint);
    console.log('CALCULATED POINT: ' + calcuPoint);
    console.log('ADDED COIN: ' + this.addedCoin);
    console.log('CALCULATED COIN: ' + calcuCoin);

    this.firestore
      .collection('/users/')
      .doc(this.userId)
      .collection('userGamification/')
      .doc('gameData')
      .update({
        points: this.previousPoint[0] + calcuPoint,
        coins: this.previousCoin[0] + calcuCoin,
      });

    this.addedPoint = [];
    this.addedCoin = [];
  }

}
