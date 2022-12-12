import { Component, OnInit } from '@angular/core';
import {PopoverController} from "@ionic/angular";
import {Router} from "@angular/router";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import firebase from "firebase/compat/app";

@Component({
  selector: 'app-journalpage',
  templateUrl: './journalpage.component.html',
  styleUrls: ['./journalpage.component.scss'],
})
export class JournalpageComponent implements OnInit {
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

  goToShopPage() {
    this.router.navigate(['/dashboard/tabs/shop']);
  }
}
