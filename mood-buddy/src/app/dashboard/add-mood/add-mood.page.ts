import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-mood',
  templateUrl: './add-mood.page.html',
  styleUrls: ['./add-mood.page.scss'],
})
export class AddMoodPage implements OnInit {
  date: string;
  dateNumber: any;
  // day: string;
  // month: string;

  constructor() { }

  ngOnInit() {
    setTimeout(() => {
      // Get current date
      this.dateNumber = new Date().toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
      // // Get today's day name
      // this.day = new Date().toLocaleString('en-us', {weekday:'long'});
      // // Get today's month name
      // this.month = new Date().toLocaleString('en-us',{ month: 'long' });
    });
  }

}
