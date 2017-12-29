import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
  selector: 'user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  emailFormControl = new FormControl('', [
    Validators.required, 
    Validators.pattern(EMAIL_REGEX)]);

  constructor(public auth: AuthService,
              private router: Router) { }


  ngOnInit() {
  }

  /// Social Login

  signInWithGoogle(): void {
    this.auth.googleLogin()
      .then(() => this.afterSignIn());
  }

  signInWithFacebook(): void {
    this.auth.facebookLogin()
      .then(() => this.afterSignIn());
  }

  signInWithTwitter(): void {
    this.auth.twitterLogin()
      .then(() => this.afterSignIn());
  }

  /// Anonymous Sign In

  signInAnonymously() {
    this.auth.anonymousLogin()
      .then(() => this.afterSignIn());
  }


  /// Shared

  private afterSignIn(): void {
    // Do after login stuff here, such router redirects, toast messages, etc.
    this.router.navigate(['/calendar']);
  }

}
