import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'app-addbutton',
  templateUrl: './addbutton.component.html',
  styleUrls: ['./addbutton.component.scss'],
})
export class AddbuttonComponent implements OnInit {

  constructor(
    private popoverController: PopoverController,
    private router: Router
  ) { }

  ngOnInit() {}

  dismiss() {
    this.popoverController.dismiss();
  }

  goToAddMoodPage() {
    this.router.navigate(['/dashboard/add-mood']);
  }

}
