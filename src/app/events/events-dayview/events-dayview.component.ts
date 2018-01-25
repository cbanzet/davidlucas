import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../core/auth.service';
import { AngularFireDatabase, 
         AngularFireList,AngularFireObject,
         AngularFireAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FormsModule, NgForm, FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import * as moment from 'moment'; // add this 1 of 4

import 'rxjs/add/operator/map';
import "rxjs/add/operator/switchMap";

import { EventService } from './../../events/shared/event.service';
import { ForfaitService } from './../../forfaits/shared/forfait.service';
import { Cart } from './../shared/cart';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './../../ui/angularmaterial.module';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-day-view',
  templateUrl: './events-dayview.component.html',
  styleUrls: ['./events-dayview.component.css']
})
export class EventsDayviewComponent implements OnInit {

  selectedCoiffeur: Observable<any[]>;

  members: Observable<any[]>;
  events: Observable<any[]>;

  calendarDate:any;
  dateForQuery:any;

  events$: Observable<AngularFireAction<any>[]>;
  date$: BehaviorSubject<string|null>;  

  times = [
    "8:00",
    "8:15",
    "8:30",
    "8:45",
    "9:00",
    "9:15",        
    "9:30",
    "9:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",    
    "11:00",     
    "11:15",
    "11:30",
    "11:45",        
    "12:00",     
    "12:15",
    "12:30",
    "12:45",  
    "13:00",     
    "13:15",
    "13:30",
    "13:45",
    "14:00",     
    "14:15",
    "14:30",
    "14:45",
    "15:00",     
    "15:15",
    "15:30",
    "15:45",
    "16:00",     
    "16:15",
    "16:30",
    "16:45",
    "17:00",     
    "17:15",
    "17:30",
    "17:45",
    "18:00",     
    "18:15",
    "18:30",
    "18:45",                                        
  ] 

  constructor(
    private eventService: EventService,
    public dialog: MatDialog,
    private db: AngularFireDatabase) 
  {
    this.members = this.eventService.getMembersListForDayViewCalendar();
    this.date$ = new BehaviorSubject(null);
    this.events$ = this.date$.switchMap(date => db.list('/events', ref =>
        date ? ref.orderByChild('date').equalTo(date) : ref
      ).snapshotChanges().map(arr => {
          return arr.map(snap => Object
            .assign(
              // snap.payload.val(), 
            { 
              $key: snap.key,
              clientfullname: `${snap.payload.val().clientFirstname} ${snap.payload.val().clientLastname}`,
              statut: snap.payload.val().statut,
              memberfirstname: snap.payload.val().memberFirstname,
              time: snap.payload.val().time,
              cartkey: snap.payload.val().cartkey?snap.payload.val().cartkey:null,
              multievent: snap.payload.val().multiEvent,
              firstofmulti: snap.payload.val().multiEvent[0],
              lastofmulti:
                snap.payload.val().multiEvent[0]==snap.payload.val().multiEvent.substr(snap.payload.val().multiEvent.length - 1)
                ?'1':'0'
            }
        ))})
    );
  }

  filterEventsBy(date: string|null) {
    this.date$.next(date);
  }

  changeDay(date,nb) {
    this.calendarDate = moment(date).add(nb,'day');
    this.dateForQuery = this.eventService.getDate(this.calendarDate);
    this.filterEventsBy(this.dateForQuery);    
  }

  getToday() {
    var today = Date.now();
    this.calendarDate = moment(today);
    this.dateForQuery = this.eventService.getDate(this.calendarDate);
    this.filterEventsBy(this.dateForQuery);
  }


  openDialogNewEvent(date,time,member): void {
    let dialogNewEventRef = this.dialog.open(DialogNewEvent, 
    {
      width: '600px',
      data: { 
        time: time,
        date: date,
        member: member,
        selectedCoiffeur: member 
      }
    });
    dialogNewEventRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }  

  openDialogSeeEvent(event, data): void {
    // console.log(event);
    // console.log(data);

    event.stopPropagation();
    let dialogSeeEventRef = this.dialog.open(DialogSeeEvent, {
      width: '500px',
      data: { 
        key: data.key,
        event: data
      }
    });
    dialogSeeEventRef.afterClosed().subscribe(result => {
      console.log('The event dialog was closed');
    });
  }  

  ngOnInit() {
    this.calendarDate = Date.now();
    this.dateForQuery = this.eventService.getDate(this.calendarDate);
    // Init Events show on grid
    this.date$.next(this.dateForQuery);
  }

}















@Component({
  selector: 'dialog-new-event',
  templateUrl: 'dialog-new-event.html',
  styleUrls: ['./dialog-new-event.css']  
})
export class DialogNewEvent implements OnInit {

  private membersRef: AngularFireList<any>;
  private prestationsRef: AngularFireList<any>;
  private eventsRef: AngularFireList<any>;

  members: Observable<any[]>;
  prestations: Observable<any[]>;
  forfaits: Observable<any[]>;
  clients: Observable<any[]>;
  clientCtrl: FormControl = new FormControl();
  filteredClients: Observable<any[]>;
  selectedClient:Observable<any[]>;

  selectPrestaOrForfait:boolean=true;
  showPrestaSelect:boolean=false;
  showForfaitsSelect:boolean=false;

  composeCart:boolean=false;

  cartData: Array<Cart> = [];
  cartFull:boolean=false;

  totalHT:number=0;
  totalTAX:number=0;
  totalTTC:number=0;

  constructor(
    private eventService: EventService,
    private forfaitService: ForfaitService,    
    private db: AngularFireDatabase,
    public dialogRef: MatDialogRef<DialogNewEvent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.forfaits = this.forfaitService.getForfaitsList();
      this.members = this.eventService.getMembersListForDayViewCalendar();
      this.clients = this.eventService.getFormatClientsList();
      this.prestations = this.eventService.getTitlePrestationsList();
    }


  onNoClick(): void {
    this.dialogRef.close();
  }

  filterClients(val: string) {
    console.log(val);
    return this.clients
    .map(response => response.filter(client => { 
      return client.lastname.toLowerCase().indexOf(val.toLowerCase()) === 0
    }));
  }

  displayFn(client) {
    if(client) {
      var fullname = `${client.firstname} ${client.lastname}`;      
    }
    else var fullname = '';
    return client ? fullname : client;
  }

  ngOnInit() {

  	this.cartData["totalHT"]=0;

    this.filteredClients = this.clientCtrl.valueChanges
      .startWith(null)
      .switchMap(client => {
        if(client) {
          if(client.lastname) { 
            this.selectedClient = client;
            return this.clients;
          }
          else return this.filterClients(client)
        } else {
          return this.filterClients('something');
        }
      })    
  }

	/////////////////////////////////////////////////////////////////
  // CART 
  insertItemInCart(key,title,time,price,salonkey){
    this.cartData.push(new Cart(key,title,time,price,salonkey));
    this.sumTablePrice('add',price);
    console.log(this.cartData);
  }
  formatBeforeInsert(isDavid,type,data) {
    var key = data.$key?data.$key:0;
    var title = data.title?data.title:0;
    var time = data.time?data.time:0;
    var price = isDavid=="David" ? data.priceDavid:data.priceTeam;
    var salonkey = data.salonkey?data.salonkey:0;
    if(key&&title&&time&&price) {
    	this.insertItemInCart(key,title,time,price,salonkey);
    }
    else {console.log("Entrée incomplète")}
  }
  removeElement(index: number) {
    this.cartData.splice(index, 1);
  }

  getTotalHT(addOrRemove,px) {
    if(addOrRemove=='add'){
      this.totalHT = Math.round((px+this.totalHT)*100)/100;
    }
    else if(addOrRemove=='remove') {
      this.totalHT = Math.round((this.totalHT-px)*100)/100;
    }
  }
  getTotalTAX() {
    this.totalTAX = Math.round((this.totalHT*0.2)*100)/100;    
  }
  getTotalTTC() {
    this.totalTTC = this.totalTAX + this.totalHT;
  }
  sumTablePrice(addOrRemove,px) {
    this.getTotalHT(addOrRemove,px);
    this.getTotalTAX();
    this.getTotalTTC();
  }


	/////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////



  saveEvent(data,client) {
    this.eventService.formatEventsCartForCreation(this.cartData,data,client,this.totalHT,this.totalTAX,this.totalTTC);
    this.dialogRef.close();
  }
}












@Component({
  selector: 'dialog-see-event',
  templateUrl: 'dialog-see-event.html',
  styleUrls: ['./dialog-see-event.css']  
})
export class DialogSeeEvent implements OnInit {

  showclientdetail: false;
  member: Observable<any[]>;
  prestation: Observable<any[]>;
  client: Observable<any[]>;
  meeting: Observable<any[]>;
  suitemeeting: any;
  paymentbutton:boolean = true;
  key: any;
  showDatePicker:boolean=false;
  showSavedDate:boolean=true;

  whatSee:boolean=true;
  seeFullMeeting:boolean=false;
  seePresta:boolean=false;

  constructor(
    private eventService: EventService,
    private router: Router,    
    private db: AngularFireDatabase,
    public dialogRef: MatDialogRef<DialogNewEvent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.key = data.event.$key;
    this.meeting = this.eventService.getEventWithKey(this.key);
    // this.suitemeeting = this.eventService.getEventsSerie(this.key,data.date,data.time);

  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  doingEvent(meeting,action) {
    this.eventService.doingEvent(meeting,action);
    if(action=='done') { 
      console.log("go to facturation"); 
      this.router.navigate(['/facturationevent/'+this.key])
    }
    this.dialogRef.close();
  }

  deleteEvent(event) {
    this.eventService.deleteEvent(event);
    this.dialogRef.close();
  }  

  ngOnInit() {
    // console.log(this.data.event);
  }

}


