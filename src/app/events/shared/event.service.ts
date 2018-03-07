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
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';

import * as moment from 'moment'; 

import { CartService } from './../../cart/shared/cart.service';
import { PrestationService } from './../../prestations/shared/prestation.service';

@Injectable()
export class EventService {

  private memberPath = '/member';
  private rolePath = '/role';
  private instrumentPath = '/instrument';
  private eventPath = '/events';

	// coiffeursRef:AngularFireList<any>;
	coiffeur: Observable<any>;
	eventsRef: AngularFireList<any>;
  meeting:  Observable<any>;
  date;
  
  starttime;endtime;


  constructor(
    private db: AngularFireDatabase, 
    private cartService: CartService,
    // private prestationService: PrestationService,    
    private router: Router) 
  { 
  	this.eventsRef = db.list('events');
    // this.coiffeursRef = db.list('members');
    // this.coiffeursRef = db.list('/role/1/members', ref => ref.orderByChild('firstname'));    
  }

//////////////////////////////////////////////////////////////////
  /////////// G E T
//////////////////////////////////////////////////////////////////

  getEventsList() {
    return this.eventsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        snap.payload.val(), 
        { 
          $key: snap.key,
          clientFullname: `${snap.payload.val().clientFirstname} ${snap.payload.val().clientLastname}`
        }) 
      )
    })
  }

  getFormatEventsList() {
    return this.eventsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object
        .assign(
          // snap.payload.val(), 
        { 
          $key: snap.key,
          clientfullname: `${snap.payload.val().clientFirstname} ${snap.payload.val().clientLastname}`,
          statut: snap.payload.val().statut,
          memberfirstname: snap.payload.val().memberFirstname,
          time: snap.payload.val().time,
          multievent: snap.payload.val().multiEvent,
        }
    ))})
  }


  getMembersList() {
    return this.db.list('members').snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(snap.payload.val(), { $key: snap.key }) )
    })
  }

  getMembersListForDayViewCalendar() {
    return this.db.list('members').snapshotChanges().map(arr => {
      return arr.map(snap => Object
        .assign(
          // snap.payload.val(), 
        { 
          $key: snap.key,
          firstname: snap.payload.val().firstname, 
          lastname: snap.payload.val().lastname,
          fullname: `${snap.payload.val().firstname} ${snap.payload.val().lastname}`,
          rolekey: snap.payload.val().role.key, 
          salonkey: snap.payload.val().salon.key         
        }
    ))})
  }

  getFormatClientsList() {
    return this.db.list('clientes').snapshotChanges().map(arr => {
      return arr.map(snap => Object
        .assign(
        { 
          $key: snap.key,
          firstname: snap.payload.val().firstname, 
          lastname: snap.payload.val().lastname,
          email: snap.payload.val().email,
          phone: snap.payload.val().phone
          // lastname: snap.payload.val().lastname             
        }
    ))})
  }

  getTitlePrestationsList() {
    return this.db.list('prestations').snapshotChanges().map(arr => {
      return arr.map(snap => Object
        .assign(
        { 
          $key: snap.key,
          acronyme: snap.payload.val().acronyme, 
          title: snap.payload.val().title, 
          details: snap.payload.val().details,             
          time: snap.payload.val().time,
          priceDavid: snap.payload.val().priceDavid,
          priceTeam: snap.payload.val().priceTeam,
          salonkey: snap.payload.val().salon.key             
        }
    ))})    
  }

  getEventWithKey(key: string) {
    this.meeting = this.db.object('events/'+ key)
      .snapshotChanges().map(action => {
        const $key = action.payload.key;
        // const prestations = Object.values(action.payload.val().prestations);
        const data = { 
          $key, 
          ...action.payload.val() };
        return data;
      });
    return this.meeting
  } 


//////////////////////////////////////////////////////////////////
  /////////// C R E A T E
//////////////////////////////////////////////////////////////////


  formatEventsCartForCreation(cart,data,client,totalHT,totalTAX,totalTTC) {

    var memberfirstname = data.selectedCoiffeur?data.selectedCoiffeur.firstname:null;
    var memberkey = data.selectedCoiffeur?data.selectedCoiffeur.$key:null;

    var dateFormat = this.getDate(data.date);
    var timestamp = moment(data.date).unix()*1000;
    this.starttime = data.time?data.time:0;

    // Création du Panier dans le Json
    var cartkey = this.cartService.createCartFromCalendar(client,this.starttime,dateFormat,totalHT,totalTAX,totalTTC);

    var dataNewEvent = {};
    dataNewEvent['cartkey'] = cartkey;
    dataNewEvent['date'] = dateFormat;
    dataNewEvent['timestamp'] = timestamp;
    dataNewEvent['clientkey'] = client?client.$key:null;
    dataNewEvent['clientfullname'] = (client.firstname||client.lastname)?`${client.firstname} ${client.lastname}`:null;      
    dataNewEvent['memberkey'] = memberkey;
    dataNewEvent['memberfirstname'] = memberfirstname;
    dataNewEvent['rolekey'] = data.selectedCoiffeur?data.selectedCoiffeur.rolekey:null; 
    dataNewEvent['salonkey'] = data.selectedCoiffeur?data.selectedCoiffeur.salonkey:null; 
    dataNewEvent['statut'] = 'waiting';

    if (cart.length) 
    {
      var dataPresta = {};
      for(var i=0; i < cart.length; i++) 
      {
        var prestationkey = cart[i].key?cart[i].key:null;

        dataPresta['cartkey'] = cartkey;
        dataPresta['prestationKey'] = prestationkey;
        dataPresta['prestationTitle'] = cart[i].title?cart[i].title:null;
        dataPresta['price'] = cart[i].price?cart[i].price:null;
        dataPresta['salonkey'] = cart[i].salonkey?cart[i].salonkey:null;        
        dataPresta['timelength'] = cart[i].time?cart[i].time:null;
        dataPresta['starttime'] = this.starttime;
        dataPresta['statut'] = 'waiting';

        // Change Start Time for next prestation
        this.starttime = this.changeStartTime(dateFormat,this.starttime,cart[i].time);

        // Ajout de la prestation dans le panier déjà créé
        if (cartkey&&prestationkey) { 
          this.cartService.createPrestaInCart(cartkey,prestationkey,memberkey,memberfirstname,dataPresta); 
        }

        // Création des events de la prestation
        this.formatEventForMultiEventsCreation(dataNewEvent,dataPresta);
      }
    }
    else { console.log('Cart Empty'); }
  }


  changeStartTime(date,starttime,n) {
    if(date&&starttime&&n) {
      var dateandtime = `${date} ${starttime}`;
      var newdateandtime = moment(dateandtime,'YYYY-MM-DD hh:mm').add(n, 'minutes');
      var hour = moment(newdateandtime).hour(); 
      var min = moment(newdateandtime).minute(); 
      if(min==0) { var newtime = `${hour}:00`; }
      else { var newtime = `${hour}:${min}`; }
      return newtime;
    }
    else { console.log('Miss parameter to change time') }
  }


  formatEventForMultiEventsCreation(data,presta) {

    var newEventData = data;
    var dateFormat = data.date;
    var starttime = presta.starttime;
    var timelength = presta.timelength;

    switch(timelength) {
      // MULTI EVENTS
      case '15':
       this.loopToAddMultipleEvent(presta,newEventData,0,dateFormat,starttime);       
       break;
      case '30':
       this.loopToAddMultipleEvent(presta,newEventData,1,dateFormat,starttime);
       break;
      case '45':
       this.loopToAddMultipleEvent(presta,newEventData,2,dateFormat,starttime);       
       break;
      case '60':
       this.loopToAddMultipleEvent(presta,newEventData,3,dateFormat,starttime);              
       break;
      case '90':
       this.loopToAddMultipleEvent(presta,newEventData,5,dateFormat,starttime);              
       break;       
      default:
        console.log("No event to create"); 
    }
  }

  loopToAddMultipleEvent(
    presta,newEventData,
    n,date,time) 
  {
    var tabeventkeys = [];
    for (var i=0; i<=n; i++) {
     var nextstarttime = this.changeStartTimeEvent(date,time,i);
     newEventData['time'] = nextstarttime;
     newEventData['multiEvent'] = `${i+1}/${n+1}`;
     newEventData['prestationkey'] = presta.prestationKey?presta.prestationKey:0;
     this.createSingleEvent(newEventData);
     // console.log("Create Event n°" + i + " at " + nextstarttime);         
    }
    return tabeventkeys;
  }

  changeStartTimeEvent(date,starttime,n) {
    var dateandtime = `${date} ${starttime}`;
    var newdateandtime = moment(dateandtime,'YYYY-MM-DD hh:mm').add(n*15, 'minutes');
    var hour = moment(newdateandtime).hour(); 
    var min = moment(newdateandtime).minute(); 
    if(min==0) { var newtime = `${hour}:00`; }
    else { var newtime = `${hour}:${min}`; }
    return newtime;
  }


  createSingleEvent(newEventData) {

    var clientkey = newEventData.clientkey;
    var memberkey = newEventData.memberkey;
    var salonkey = newEventData.key;
    var cartkey = newEventData.cartkey;
    var prestationkey = newEventData.prestationkey;

    console.log(prestationkey);

    // INSERT EVENT IN EVENTS NODE
    var eventkey = this.eventsRef.push(newEventData).key;

    // INSERT EVENT IN CLIENT/COIFFEUR/SALON/ NODES
    const clientPath = `clientes/${clientkey}/events/${eventkey}/`;
    const coiffeurPath = `members/${memberkey}/events/${eventkey}/`;
    const coiffeurInRolePath = `memberRole/3/members/${memberkey}/events/${eventkey}/`;
    // const salonPath = `salons/${salonkey}/events/${eventkey}/`;
    // const eventsInPrestaInCart = `carts/${cartkey}/events/${eventkey}`;

    // Keep Event Key for removing presta from cart and for changing hairdresser's presta
    const eventsInPrestaInCart = `carts/${cartkey}/prestations/${prestationkey}/events/${eventkey}`;
    // Keep All Events Key For Deleting Cart Button in Modal See Cart
    // const allEventsLinkedToCart = `carts/${cartkey}/alleventslinked/${eventkey}`;

    // const membersWithEventsCart = `carts/${cartkey}/membersevents/${memberkey}/${eventkey}`;

    var updateData = {};
    updateData[clientPath]= true;
    updateData[coiffeurPath]= true;
    // updateData[salonPath]= true;
    updateData[eventsInPrestaInCart]= eventkey;
    // updateData[membersWithEventsCart]= true;
    // updateData[coiffeurInRolePath]= true;
    // updateData['/lookUpSalonEvents/'+salonkey+'/'+eventkey]= true;
    updateData['/lookUpMemberEvents/'+memberkey+'/'+eventkey]= true;
    updateData['/lookUpClientEvents/'+clientkey+'/'+eventkey]= true;

    this.db.object("/").update(updateData).then(_=> console.log(updateData));

    return eventkey;
  }



//////////////////////////////////////////////////////////////////
  /////////// E D I T
//////////////////////////////////////////////////////////////////


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



//////////////////////////////////////////////////////////////////
  /////////// D E L E T E 
//////////////////////////////////////////////////////////////////



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



//////////////////////////////////////////////////////////////////
  /////////// F U N C T I O N S
//////////////////////////////////////////////////////////////////


  getDate(nb) {
    var day = moment(nb).date();
    var month = (moment(nb).month())+1;
    var year = moment(nb).year(); 
    var date = `${day}-${month}-${year}`;
    return date;
  }


}
