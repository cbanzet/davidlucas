import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';

import { EventService } from './../shared/event.service';
import { ClientService } from './../../clients/shared/client.service';

import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

	events: Observable<any[]>;
	coiffeurs: Observable<any[]>;
  clients: Observable<any[]>;

	filteredClient: Observable<any[]>;
	clientCtrl: FormControl = new FormControl();

	pagetitle="New Event";
	pagesubtitle="Choose the type of event";

	step1=true;

  constructor(private router: Router,
              private location: Location,
              private clientService: ClientService,
  						private eventService: EventService) { 
  	this.events = this.eventService.getEventsList();
  	// this.coiffeurs = this.eventService.getArtistsList();
    this.clients = this.clientService.getClientsList();
  }

  ngOnInit() {

    this.filteredClient = this.clientCtrl.valueChanges
      .startWith(null)
      .switchMap(client => {
        if(client) {
          if(client.inserdate) { 
            console.log('Goto Composer Page'); 
            var key = client.$key;
            // this.router.navigate(['/composer/'+key]);
            return this.clients;
          }
          else return this.filterClient(client)
        } else {
          // do something better here :P
          console.log('Do not get this case');
          return this.filterClient('something');
        }
      })

  }

  onSubmit(newEventForm: NgForm) {
  	// this.eventService.createEvent(newEventForm);
  }  

  filterClient(val: string) {
    return this.clients
      .map(response => response.filter(client => { 
        return client.firstname.toLowerCase().indexOf(val.toLowerCase()) === 0
      }));
  }

  displayFn(client) {
    if(client) {
      var fullname = `${client.firstname} ${client.lastname}`;      
    }
    else var fullname = '';
    return client ? fullname : client;
  }


  goBack(): void {
    this.location.back();
  }



}
