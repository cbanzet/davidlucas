import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { EventService } from './../shared/event.service';

@Component({
  selector: 'event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

	events: Observable<any[]>;

  constructor(
  	private router: Router,
  	private eventService: EventService) { }

  ngOnInit() {
    this.events = this.eventService.getEventsList();  	
  }

  deleteEvent(event) {
    this.eventService.deleteEvent(event);    
  }

}
