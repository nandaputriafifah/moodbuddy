import { Component } from '@angular/core';
import {GamificationService} from "./shared/gamification.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor( ) {}
  //
  // ionViewDidEnter() {
  //   // this.gamificationService.UserLevelUp();
  //   this.gamificationService.showDailyReward();
  //   console.log('ionViewDidEnter');
  // }
}
