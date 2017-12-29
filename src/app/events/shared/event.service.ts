import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { AngularFireModule } from 'angularfire2';

import { 	AngularFireDatabase, 
					AngularFireList, 
					AngularFireObject } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';
import { Event } from './event';

import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import "rxjs/add/operator/switchMap";


import * as moment from 'moment'; 


@Injectable()
export class EventService {

  private memberPath = '/member';
  private rolePath = '/role';
  private instrumentPath = '/instrument';
  private eventPath = '/events';

	artistsRef:AngularFireList<any>;
	artist: Observable<any>;
	eventsRef: AngularFireList<any>;
  meeting:  Observable<any>;


  constructor(private db: AngularFireDatabase, private router: Router) 
  { 
  	this.eventsRef = db.list('events');
  }


  /////////// G E T


  getEventsList() {
    return this.eventsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    })
  }

  getMembersList() {
    return this.db.list('members').snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    })
  }

  getEvent(key) {
    // return this.db.object('events/'+key).snapshotChanges().map(arr => {
      // return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    // })
  }

  // Return Member with Key
  getEventWithKey(key: string) {
    this.meeting = this.db.object('events/'+ key)
      .snapshotChanges().map(action => {
        const $key = action.payload.key;
        const data = { $key, ...action.payload.val() };
        return data;
      });
    return this.meeting
  }   





  /////////// C R E A T E



  createEvent(data,client) {
    // console.log(data);
    // console.log(client);

    const memberkey = data?data.member.$key:0;
    const prestakey = data?data.prestation.key:0;
    const clientkey = client?client.key:0;
    const salonkey = data.member.salon?data.member.salon.key:0;
    const rolekey = data.member.role?data.member.role.key:0;
    
    const dateFormat = this.getDate(data.date);
    const timestamp = moment(data.date).unix()*1000;

    var newEventData = {}
    newEventData['time'] = data?data.time:0;
    newEventData['date'] = dateFormat;
    newEventData['timestamp'] = timestamp;
    newEventData['memberFirstname'] = data?data.member.firstname:0;
    newEventData['memberLastname'] = data?data.member.lastname:0;
    newEventData['memberKey'] = memberkey;
    newEventData['memberRoleKey'] = rolekey;    
    newEventData['prestationTitle'] = data?data.prestation.title:0;
    newEventData['prestationKey'] = prestakey;
    newEventData['prestationAcronyme'] = data?data.prestation.acronyme:0;
    newEventData['prestationPriceTeam'] = data?data.prestation.priceTeam:0;
    newEventData['prestationPriceDavid'] = data?data.prestation.priceDavid:0;
    newEventData['clientKey'] = clientkey;
    newEventData['clientFirstname'] = client?client.firstname:0;
    newEventData['clientLastname'] = client?client.lastname:0;
    newEventData['clientPhone'] = client?client.phone:0;
    newEventData['clientEmail'] = client?client.email:0;
    newEventData['salonKey'] = salonkey;
    newEventData['salon'] = data.member.salon?data.member.salon.title:0;
    newEventData['statut'] = "waiting";
    console.log(newEventData);
   
    // INSERT EVENT IN EVENTS TAB
    var eventkey = this.eventsRef.push(newEventData).key;

    // INSERT EVENT IN CLIENT/COIFFEUR/SALON/ TAB
    const clientPath = `clientes/${clientkey}/events/${eventkey}/`;
    const coiffeurPath = `members/${memberkey}/events/${eventkey}/`;
    const salonPath = `salons/${salonkey}/events/${eventkey}/`;

    var updateData = {};
    updateData[clientPath]= newEventData;
    updateData[coiffeurPath]= newEventData;
    updateData[salonPath]= newEventData;
    console.log(updateData);
    this.db.object("/").update(updateData).then(_=> console.log('EVENT SAVED!'+ newEventData));
    
    // INSERT IN LOOK UP
    this.db.list('/lookUpSalonEvents').update(salonkey, {[eventkey]:true});
    this.db.list('/lookUpMemberEvents').update(memberkey, {[eventkey]:true});
    this.db.list('/lookUpClientEvents').update(clientkey, {[eventkey]:true});
  }




  /////////// E D I T

  doingEvent(data,action) {
    const eventkey = data?data.$key:0;
    const memberkey = data?data.memberKey:0;
    const prestakey = data?data.prestationKey:0;
    const clientkey = data?data.clientKey:0;
    const salonkey = data?data.salonKey:0;
    const rolekey = data?data.memberRoleKey:0;

    const value = action;

    const eventPath = `events/${eventkey}/statut/`;
    const eventInClientPath = `clientes/${clientkey}/events/${eventkey}/statut/`;
    const eventInCoiffeurPath = `members/${memberkey}/events/${eventkey}/statut/`;
    const eventInSalonPath = `salons/${salonkey}/events/${eventkey}/statut/`;

    var updateData = {};
    updateData[eventPath]= action;
    updateData[eventInClientPath]= action;
    updateData[eventInCoiffeurPath]= action;
    updateData[eventInSalonPath]= action;

    // console.log(data);
    // console.log(updateData);
    // console.log(value);
    // console.log(eventkey,memberkey,prestakey,clientkey,salonkey,rolekey)

    this.db.object("/").update(updateData).then(_=>console.log('Event Happening!'));
  }


  /////////// D E L E T E 

  deleteEvent(event) {
    console.log(event);
    const eventkey = event?event.$key:0;
    const memberkey = event?event.memberKey:0;
    const prestakey = event?event.prestationKey:0;
    const clientkey = event?event.clientKey:0;
    const salonkey = event?event.salonKey:0;
    const rolekey = event?event.memberRoleKey:0;

    console.log(eventkey,memberkey,prestakey,clientkey,salonkey,rolekey);

    const eventPath = `events/${eventkey}`;
    const eventInClientPath = `clientes/${clientkey}/events/${eventkey}/`;
    const eventInCoiffeurPath = `members/${memberkey}/events/${eventkey}/`;
    const eventInCoiffeurRolePath = `memberRole/${rolekey}/members/${memberkey}/events/${eventkey}/`;
    const eventInSalonPath = `salons/${salonkey}/events/${eventkey}/`;

    this.db.object(eventPath).remove();
    this.db.object(eventInClientPath).remove();
    this.db.object(eventInCoiffeurPath).remove();
    this.db.object(eventInCoiffeurRolePath).remove();
    this.db.object(eventInSalonPath).remove();

    this.db.list('/lookUpSalonEvents/'+ salonkey + eventkey).remove();
    this.db.list('/lookUpMemberEvents'+ memberkey + eventkey).remove();
    this.db.list('/lookUpClientEvents'+ clientkey + eventkey).remove();
  } 


  /////////// F U N C T I O N S

  getDate(nb) {
    var day = moment(nb).date();
    var month = (moment(nb).month())+1;
    var year = moment(nb).year(); 
    var date = `${day}-${month}-${year}`;
    return date;
  }


}
