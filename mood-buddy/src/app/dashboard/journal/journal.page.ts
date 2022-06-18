import { Component, OnInit } from '@angular/core';
import {UserService} from "../../shared/user.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-journal',
  templateUrl: './journal.page.html',
  styleUrls: ['./journal.page.scss'],
})
export class JournalPage implements OnInit {
  users: any;

  constructor(private userSrv: UserService) { }

  ngOnInit() {
    // this.userSrv.getAll().snapshotChanges().pipe(
    //   map(changes =>
    //     changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
    //   )
    // ).subscribe(data => {
    //   this.users = data;
    //   console.log(data);
    // });
  }

}
