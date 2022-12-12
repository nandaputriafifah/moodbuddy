import { Component, OnInit } from '@angular/core';
import {AddbuttonComponent} from "./addbutton/addbutton.component";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  constructor(
    private popoverController: PopoverController
  ) { }

  ngOnInit() {}

  dismiss() {
    this.popoverController.dismiss();
  }

  async presentPopoverAddButton() {
    const popover = await this.popoverController.create({
      cssClass: 'add-button',
      component: AddbuttonComponent,
      backdropDismiss: false
    });
    return await popover.present();
  }
}
