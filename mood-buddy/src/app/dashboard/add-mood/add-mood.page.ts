import {Component, OnInit, ViewChild} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from "firebase/compat/app";
import {Router} from "@angular/router";
import {CalendarComponent} from "ionic2-calendar";
import {AuthenticationService} from "../../shared/authentication.service";
import {GamificationService} from "../../shared/gamification.service";


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

  coins: number;
  levels: number;
  points: number;

  totalCheckIn: number = 0;
  checkIn = [];

  addedPoint = [];
  previousPoint = [];
  addedCoin = [];
  previousCoin = [];
  counterFlag = [];
  counter: boolean;

  checkInCounter: number = 0;
  checkInFlag: boolean = false;
  nampung = [];
  calcuNampung: number;

  checkedFeelings:any;
  checkedActivity:any;

  // points = 0;
  // coins = 0;
  // totalPoints: any;
  // totalCoins: any;

  addMood: {currentDate: string;
    date: string;
    currentMood: string;
    currentFeeling: string;
    activities: string;
    notes: string;};

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
    private router: Router,
    // private gamificationService: GamificationService
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

  // ionViewDidLeave() {
  //   this.gamificationService.UserLevelUp();
  //   console.log('ionViewDidLeave');
  // }

  /** Function for add mood check-in to firebase */
  AddMood(date, currentMood, notes){
    let addMood = {};
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
    }

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

    addMood['currentDate'] = this.currDate;
    addMood['date'] = date;
    addMood['currentMood'] = currentMood;
    addMood['currentFeeling'] = arrayFeelings;
    addMood['activities'] = arrayActivities;
    addMood['notes'] = notes;

    console.log(addMood);

      // Create new collection named 'moodCheckIn'
      // Firestore will create id for everytime user added mood
    this.firestore.collection('/users/').doc(this.userId).collection('moodCheckIn/').add(addMood).then(()=>{
      this.addMood = {currentDate: '', date: '', currentMood: '', currentFeeling: '', activities: '', notes: ''}
      this.router.navigate(['/dashboard/tabs/journal']);
      })

    this.firestore.collection('/users/').doc(this.userId).collection('event/').add(event);

    // this.firestore
    //   .collection('/users/')
    //   .doc(this.userId)
    //   .collection('userCheckInCounter/')
    //   .doc(this.currDate.split('T')[0])
    //   .set({
    //     counter: this.checkInCounter,
    //     counterFlag: this.checkInFlag
    //   });

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
        // this.checkIn = [];
        res.forEach((val) => {
          this.moodCountLength = val.payload.doc.data()['date'].split('T')[0];
          if (this.moodCountLength == this.currDate.split('T')[0]) {
            // Push into arrays to get the length of the same date as current date
            this.totalCounts.push(this.moodCountLength);
            console.log(this.totalCounts);
          }
          // console.log(`Total CheckIn Before: ${this.checkIn.length}`);
          // if (this.currDate.split('T')[0] == date.split('T')[0] && this.checkIn.length < 1) {
          //   // this.totalCheckIn = this.totalCheckIn + testing;
          //   this.totalCheckIn++;
          //   this.checkIn.push(1);
          //   // this.totalCheckIn = this.checkIn.reduce((accum, a) => accum + a, 0);
          //   // console.log(this.checkIn);
          //   console.log('Total CheckIn: ' + this.totalCheckIn);
          //   console.log(`Total CheckIn After: ${this.checkIn}` + this.checkIn.length);
          //   this.SumMoodCount();
          // }
        })
        // Points & coins will be added,
        // if the current date as same as the date input, AND total counts <= 2

        // let testing = 1;

        /** LENGTH MASIH BUG KALAU CHECK-IN DIHAPUS**/
        if (this.currDate.split('T')[0] == date.split('T')[0] && this.totalCounts.length <= 2){
          const test = [];
          test.push(this.totalCounts.length);
          let total = test.reduce((accum, a) => accum + a, 0);
          console.log('Test Counts Length: ');
          console.log(test);

          console.log('Total Counts Length: ');
          console.log(total);
          this.SumMoodCount();
        }

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
    // Get value of count in checkInCounts
    // this.firestore
    //   .collection('/users/')
    //   .doc(this.userId)
    //   .collection('userCheckInCounter/')
    //   .doc(this.currDate.split('T')[0])
    //   .snapshotChanges().subscribe(res => {
    //     console.log(res.payload.data());
    //     this.checkInCounter = res.payload.data()['counter'];
    //     this.checkInFlag = res.payload.data()['counterFlag'];
    // });

    // console.log('NAMPUNG:');
    // console.log(this.nampung);

    // if (this.calcuNampung <= 2 && this.checkInFlag == false) {
    //   this.nampung.push(1);
    //   this.calcuNampung = this.nampung.reduce((accum, a) => accum + a, 0);
    //   console.log('CALCU NAMPUNG = ' + this.calcuNampung);

      // this.counter = false;
      // console.log('COUNTER 1 = ' + this.counter);

      // if (this.counterFlag.length <= 2) {
      // console.log('DO SUM MOOD COUNT');
      // this.counterFlag = [];
      // this.counterFlag.push(1);
      // console.log(this.counterFlag);
      //
      // let calcuCounterFlag = this.counterFlag.reduce((accum, a) => accum + a, 0);


      //
      // this.firestore.collection('users/')
      //   .doc(this.userId)
      //   .collection('counterFlag/')
      //   .doc(`${this.counterFlag}`)
      //   .snapshotChanges().subscribe(res =>{
      //   this.previousPoint.push(res.payload.data()['points']);
      //   this.previousCoin.push(res.payload.data()['coins']);
      //   return [this.previousPoint, this.previousCoin];
      //   // this.totalPoints = res['points']
      //   // this.totalCoins = res['coins']
      //   // return this.totalPoints;
      // })

      // let calcuCounterFlag =+ 1;
      // console.log('calcuCounterFlag: ' + calcuCounterFlag);
      this.addedPoint.push(25);
      this.addedCoin.push(500);

      let calcuPoint = this.addedPoint.reduce((accum, a) => accum + a, 0);
      let calcuCoin = this.addedCoin.reduce((accum, a) => accum + a, 0);

      console.log('ADDED POINT: ' + this.addedPoint);
      console.log('CALCULATED POINT: ' + calcuPoint);
      console.log('ADDED COIN: ' + this.addedCoin);
      console.log('CALCULATED COIN: ' + calcuCoin);

      console.log('PREVIOUS COIN:');
      console.log(this.previousCoin);

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

      // this.firestore
      //   .collection('/users/')
      //   .doc(this.userId)
      //   .collection('userCheckInCounter/')
      //   .doc(this.currDate.split('T')[0])
      //   .set({
      //     counter: this.calcuNampung,
      //     counterFlag: this.checkInFlag
      //   });
      //
      // console.log(this.nampung);
      // console.log('NAMPUNG = ' + this.calcuNampung);
      // console.log('COUNTER = ' + this.checkInCounter);
      // console.log('Counter Flag= ' + this.counterFlag.length);

      // this.nampung = [];
    // }

    //
    // if (this.calcuNampung == 2){
    //   this.checkInFlag = true;
    //
    //   this.firestore
    //     .collection('/users/')
    //     .doc(this.userId)
    //     .collection('userCheckInCounter/')
    //     .doc(this.currDate.split('T')[0])
    //     .set({
    //       counter: this.calcuNampung,
    //       counterFlag: this.checkInFlag
    //     });
    //
    //
    //   // this.counter = true;
    //   // console.log('COUNTER = TRUE');
    // }

    }
    // if (this.counterFlag.length > 2){
    //     this.counter = true;
    //     console.log('COUNTER = TRUE');
    // }
  // }
}
