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

  dateValue: string;
  maxDate: string;

  //Calendar
  viewTitle: string;
  selectedDate = new Date();
  eventSource: []

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
    console.log(this.eventId);
  }

  UpdateMood(date, currentMood, currentFeeling, activities, notes){
    let updateMood = {}

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

      updateMood['date'] = date,
      updateMood['currentMood'] = currentMood,
      updateMood['currentFeeling'] = currentFeeling,
      updateMood['activities'] = activities,
      updateMood['notes'] = notes,
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

  // Calendar
  // Change current month/week/day
  // next() {
  //   this.myCal.slideNext();
  // }
  //
  // back() {
  //   this.myCal.slidePrev();
  // }
  //
  // onEventSelected(event) {
  //   console.log(
  //     "Event selected:" +
  //     event.startTime +
  //     "-" +
  //     event.endTime +
  //     "," +
  //     event.title
  //   );
  // }
  //
  // onTimeSelected(ev) {
  //   console.log(
  //     "Selected time: " +
  //     ev.selectedTime +
  //     ", hasEvents: " +
  //     (ev.events !== undefined && ev.events.length !== 0) +
  //     ", disabled: " +
  //     ev.disabled
  //   );
  //   this.selectedDate = ev.selectedTime;
  // }
  //
  // onViewTitleChanged(title) {
  //   this.viewTitle = title;
  //   console.log(title);
  // }
  //
  // onCurrentDateChanged(event: Date) {
  //   console.log("current date change: " + event);
  // }

}
