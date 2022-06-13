import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    public authService: AuthenticationService,
    public router: Router
  ) { }

  ngOnInit() {
  }
  signUp(email, password){
    this.authService.RegisterUser(email.value, password.value)
      .then((res) => {
        this.authService.SendVerificationMail()
        this.router.navigate(['verify-email']);
      }).catch((error) => {
      window.alert(error.message)
    })
  }
}
