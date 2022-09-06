import {Component, Inject, LOCALE_ID, OnInit, ViewChild} from '@angular/core';
import firebase from "firebase/compat/app";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {AlertController, ModalController} from "@ionic/angular";
import {UpdatemoodComponent} from "../../components/updatemood/updatemood.component";
import {CalendarComponent} from "ionic2-calendar";
import {formatDate} from "@angular/common";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
  userId: any;
  date: string;
  dateNumber: any;
  maxDate: string;
  filterDate: any;
  moodList: {moodId: string; date: string; currentMood: string; currentFeeling: string; activities: string; notes: string }[];

  // Calendar
  eventSource = [];
  eventId: any;
  viewTitle: string;
  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };

  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  selectedDate: Date;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private modalController: ModalController,
    private alertCtrl: AlertController,
    @Inject(LOCALE_ID) private locale: string,
    ) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    // Define user data
      this.firestore
        .collection('users/')
        .doc(this.userId)
        .collection('moodCheckIn/', ref => ref.orderBy('date', 'asc'))
        .snapshotChanges()
        .subscribe(res=>{
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

    // Read event calendar in firebase
    this.firestore
      .collection('users/')
      .doc(this.userId)
      .collection('event/')
      .snapshotChanges()
      .subscribe((colSnap) => {
        this.eventSource = [];
        colSnap.forEach((snap) => {
          const event: any = snap.payload.doc.data();
          this.eventId = snap.payload.doc.id;
          event.id = snap.payload.doc.id;
          event.startTime = event.startTime.toDate();
          event.endTime = event.endTime.toDate();
          console.log(event);
          this.eventSource.push(event);
        });
      });

    // Add [max] option in add-mood.page.html to disable input future date
    // Change format maxDate into yyyy-mm-dd ([max] option ONLY works in this date format)
    // this.maxDate = new Date().toISOString().split('T')[0];
    //   console.log(this.maxDate);

    setTimeout(() => {
      // Get current date
      this.dateNumber = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    });
  }

  // Calendar
  // Change current month/week/day
  next() {
    this.myCal.slideNext();
  }

  back() {
    this.myCal.slidePrev();
  }

  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);

    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK'],
    });
    alert.present();
  }

  createRandomEvents() {
    var events = [];
    for (var i = 0; i < 50; i += 1) {
      var date = new Date();
      var eventType = Math.floor(Math.random() * 2);
      var startDay = Math.floor(Math.random() * 90) - 45;
      var endDay = Math.floor(Math.random() * 2) + startDay;
      var startTime;
      var endTime;
      if (eventType === 0) {
        startTime = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + startDay
          )
        );
        if (endDay === startDay) {
          endDay += 1;
        }
        endTime = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate() + endDay
          )
        );
        events.push({
          title: 'All Day - ' + i,
          startTime: startTime,
          endTime: endTime,
          allDay: true,
        });
      } else {
        var startMinute = Math.floor(Math.random() * 24 * 60);
        var endMinute = Math.floor(Math.random() * 180) + startMinute;
        startTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + startDay,
          0,
          date.getMinutes() + startMinute
        );
        endTime = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + endDay,
          0,
          date.getMinutes() + endMinute
        );
        events.push({
          title: 'Event - ' + i,
          startTime: startTime,
          endTime: endTime,
          allDay: false,
        });
      }
    }
    this.eventSource = events;
  }

  removeEvents() {
    this.eventSource = [];
  }

  async UpdateMood(eventId, id, date, currentMood, currentFeeling, activities, notes) {
    const modal = await this.modalController.create({
      component:  UpdatemoodComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        'eventId': eventId,
        'id': id,
        'date': date,
        'currentMood': currentMood,
        'currentFeeling': currentFeeling,
        'activities': activities,
        'notes': notes
      }
    });
    return await modal.present();
  }

  DeleteMood(moodId, eventId){
    this.firestore.collection('users/').doc(this.userId).collection('moodCheckIn/').doc(moodId).delete();
    this.firestore.collection('users/').doc(this.userId).collection('event/').doc(eventId).delete();
    this.eventSource = [];
  }

  GoToStatisticPage() {
    this.router.navigate(['/dashboard/statistic']);
  }

  ApplyDateFilter(selectedDate: any) {
    // if (!selectedDate) {
    //   console.log("Empty date")
    //   return
    // }

    const selectedDateMonthNumber = selectedDate.split("-")[1].split("")[1];
    const dateFormat = new Date();
    dateFormat.setMonth(selectedDateMonthNumber - 1);

    const selectedDateMonthName = dateFormat.toLocaleString('en-US', {
      month: 'long',
    })
    console.log(selectedDateMonthName);

    this.firestore.collection('users/').doc(this.userId).collection('moodCheckIn/').valueChanges().subscribe(res=>{
      res.forEach((value) => {
        this.filterDate = value.date.split(" ")[0];
        console.log(this.filterDate);

        if (this.filterDate == selectedDateMonthName) {
          return
        }
        // const filteredDate = this.firestore.collection('users/').doc(this.userId).collection('moodCheckIn/', ref =>
        //   ref.where('date', '==', selectedDateMonthName)).get();
      });
    });
  }
}
