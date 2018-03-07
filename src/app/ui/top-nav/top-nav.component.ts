import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.css']
})
export class TopNavComponent implements OnInit {

	today: number = Date.now();
	showtime;

  constructor(public auth: AuthService, private router: Router) {}


  ngOnInit() {
  }

  gotoUserProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.auth.signOut();
  }
  
}
