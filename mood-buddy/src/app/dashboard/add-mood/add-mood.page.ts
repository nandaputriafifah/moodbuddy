import { Component, OnInit } from '@angular/core';
import {UserService} from "../../shared/user.service";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";

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

  constructor(
    private router: Router,
    private userSrv: UserService
  ) { }

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

  // onSubmit(form: NgForm) {
  //   console.log('Form', form);
  //
  //   this.userSrv.create(form.value).then(res => {
  //     console.log('res', res);
  //     this.router.navigateByUrl('/dashboard/tabs/journal');
  //   }).catch(error => console.log(error));
  //
  //   form.reset();
  //   this.router.navigateByUrl('/dashboard/tabs/journal');
  // }

}
