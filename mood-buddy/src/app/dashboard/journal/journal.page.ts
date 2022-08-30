import { Component, OnInit } from '@angular/core';
import firebase from "firebase/compat/app";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {Router} from "@angular/router";
import {ModalController} from "@ionic/angular";
import {UpdatemoodComponent} from "../../components/updatemood/updatemood.component";
import {collection, query} from "@angular/fire/firestore";

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

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private modalController: ModalController
    ) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {
    // Define user data
      this.firestore.collection('users/').doc(this.userId).collection('moodCheckIn/', ref => ref.orderBy('date', 'asc')).snapshotChanges().subscribe(res=>{
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

    // Add [max] option in add-mood.page.html to disable input future date
    // Change format maxDate into yyyy-mm-dd ([max] option ONLY works in this date format)
    // this.maxDate = new Date().toISOString().split('T')[0];
    //   console.log(this.maxDate);

    setTimeout(() => {
      // Get current date
      this.dateNumber = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    });
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
