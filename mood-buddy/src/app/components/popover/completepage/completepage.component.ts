import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {PopoverController} from "@ionic/angular";
import {Router} from "@angular/router";
import firebase from "firebase/compat/app";

@Component({
  selector: 'app-completepage',
  templateUrl: './completepage.component.html',
  styleUrls: ['./completepage.component.scss'],
})
export class CompletepageComponent implements OnInit {
  userId: any;

  constructor(
    private firestore: AngularFirestore,
    private popoverController: PopoverController,
    private router: Router
  ) {
    this.userId = firebase.auth().currentUser.uid;
  }

  ngOnInit() {}

  dismiss() {
    this.popoverController.dismiss();
  }

  GoToLandingPage() {
    this.router.navigate(['/dashboard/tabs/landing-page'])
      .then(() => {
        this.firestore
          .collection('users/')
          .doc(this.userId)
          .update({
            showTutorial: false
          });
      })
  }
}
