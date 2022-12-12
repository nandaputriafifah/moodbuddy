import { Component, OnInit } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {PopoverController} from "@ionic/angular";
import {Router} from "@angular/router";
import firebase from "firebase/compat/app";
import {AddbuttonComponent} from "../addbutton/addbutton.component";
import {BuyitemsComponent} from "../buyitems/buyitems.component";

@Component({
  selector: 'app-shoppage',
  templateUrl: './shoppage.component.html',
  styleUrls: ['./shoppage.component.scss'],
})
export class ShoppageComponent implements OnInit {

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

  async presentPopoverBuyItems() {
    const popover = await this.popoverController.create({
      cssClass: 'buy-items',
      component: BuyitemsComponent,
      backdropDismiss: false
    });
    return await popover.present();
  }
}
