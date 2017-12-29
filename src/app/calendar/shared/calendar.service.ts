import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { FirebaseApp } from 'angularfire2';
import { 	AngularFireDatabase, 
					AngularFireList, 
					AngularFireObject } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Event } from './event';

import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Injectable()
export class CalendarService {

  private eventPath = '/events';

	clientsRef:AngularFireList<any>;
	client: Observable<any>;

	eventsRef: AngularFireList<any>;
  event:  Observable<any>;

  constructor(private db: AngularFireDatabase, private router: Router) { 
  	this.eventsRef = db.list('/events');
    this.clientsRef = db.list('/clientes');	  	
  }


  createEvent(newEventForm): void {
    var newEventData = {}
    newEventData['timestamp'] = Date.now();
    newEventData['title'] = newEventForm?newEventForm.value.newEventTitle:0;
    newEventData['place'] = newEventForm?newEventForm.value.newEventPlace:0;
    newEventData['date'] = newEventForm?newEventForm.value.datepicker:0;
    // newEventData['lastname'] = this.emptyField(newComposerForm.value.newComposerlastname);
  	
    // console.log(newEventForm.value);
    // console.log(newEventData);
  	// INSERT EVENT IN EVENT TAB
  	// this.eventsRef.push(newEventData).then(_=>
  		// console.log("Event Saved!")
  	// );
  	// INSERT EVENT IN ARTIST/MANAGER/ROLE/INSTRUMENT TAB
    // const eventInArtistPath = `${this.memberPath}/${artistkey}/`;
    // const eventInAgentPath = `${this.memberPath}/${agentkey}/events/`;
    // const eventInAgentRolePath = `${this.memberPath}/${agentkey}/events/`;
    // const eventInArtistRolePath = `${this.memberPath}/${agentkey}/events/`;

    // this.router.navigate(['/events']);  	
  }  





}
