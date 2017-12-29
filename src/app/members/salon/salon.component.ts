import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, 
         AngularFireList,
         AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-salon',
  templateUrl: './salon.component.html',
  styleUrls: ['./salon.component.css']
})
export class SalonComponent implements OnInit {

	salonsGrid: boolean;
	salonCard: boolean;
  showSalonToolbar: boolean;

  private membersRef: AngularFireList<any>;
  members: Observable<any[]>;

  private prestaRef: AngularFireList<any>;
  prestas: Observable<any[]>;  

  constructor(private db: AngularFireDatabase) {
    this.prestaRef = db.list('services');
    this.prestas = this.prestaRef.valueChanges();

    this.membersRef = db.list('members');
    this.members = this.membersRef.snapshotChanges().map(changes => {
      return changes.map(c => ({ key: c.payload.key, ...c.payload.val() }));
    });
  }

  ngOnInit() {
  	this.salonsGrid = true;
  	this.salonCard = false;   	
  }

  gotoSalonGrid() {
  	this.salonsGrid = false;
  	this.salonCard = true;
    this.showSalonToolbar = true;
  }

}
