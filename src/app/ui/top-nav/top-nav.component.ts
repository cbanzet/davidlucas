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

  constructor(private auth: AuthService, private router: Router) {}


  ngOnInit() {
  	// this.showtime = this.datePipe.transform(new Date());
  }

  gotoUserProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.auth.signOut();
  }
  
}
