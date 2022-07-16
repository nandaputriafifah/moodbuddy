import { Component, OnInit } from '@angular/core';
import firebase from "firebase/compat/app";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {UpdatemoodComponent} from "../../components/updatemood/updatemood.component";
import {orderBy} from "@angular/fire/firestore";
import {orderByChild} from "@angular/fire/database";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
  userId: any;
  moodList: {moodId: string; date: string; currentMood: string; currentFeeling: string; activities: string; notes: string }[];

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private modalController: ModalController
    ) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    // Define user authentication
      this.firestore.collection('users/').doc(this.userId).collection('moodCheckIn/', ref => ref.orderBy('date', 'desc')).snapshotChanges().subscribe(res=>{
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

  async UpdateMood(id, date, currentMood, currentFeeling, activities, notes) {
    const modal = await this.modalController.create({
      component:  UpdatemoodComponent,
      cssClass: 'my-custom-class',
      componentProps: {
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

  DeleteMood(id){
      this.firestore.collection('users/').doc(this.userId).collection('moodCheckIn/').doc(id).delete()
  }
}
