import {Component, OnInit} from '@angular/core';
import {UpdatemoodComponent} from "../../components/updatemood/updatemood.component";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import firebase from "firebase/compat/app";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.page.html',
  styleUrls: ['./timeline.page.scss'],
})
export class TimelinePage implements OnInit {
  userId: any;
  date: string;
  dateNumber: any;
  maxDate: string;
  filterDate: any;
  moodList: {moodId: string; date: string; currentMood: string; currentFeeling: string; activities: string; notes: string }[];

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private modalController: ModalController) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    // Define user's moodCheckIn data in firebase
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

  DeleteMood(eventId, moodId){
    this.firestore.collection('users/').doc(this.userId).collection('moodCheckIn/').doc(moodId).delete();
    this.firestore.collection('users/').doc(this.userId).collection('event/').doc(eventId).delete();
  }

}
