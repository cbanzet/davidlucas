import { Component, OnInit, Inject } from '@angular/core';
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

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './../../ui/angularmaterial.module';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrls: ['./day-view.component.css']
})
export class DayViewComponent implements OnInit {

  selectedCoiffeur: Observable<any[]>;
  memberfromtable: Observable<any[]>;

  private clientsRef: AngularFireList<any>;
  clients: Observable<any[]>;  
  private prestationsRef: AngularFireList<any>;
  prestations: Observable<any[]>;

  members: Observable<any[]>;
  events: Observable<any[]>;
  presta: any;

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
    private db: AngularFireDatabase) {

    this.members = this.eventService.getMembersList();

    this.date$ = new BehaviorSubject(null);
    this.events$ = this.date$.switchMap(date =>
      db.list('/events', ref =>
        date ? ref.orderByChild('date').equalTo(date) : ref
      ).snapshotChanges()
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
    let dialogNewEventRef = this.dialog.open(DialogNewEvent, {
      width: '400px',
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
    event.stopPropagation();
    let dialogSeeEventRef = this.dialog.open(DialogSeeEvent, {
      width: '400px',
      data: { 
        key: data.payload.key
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
  clients: Observable<any[]>;
  clientCtrl: FormControl = new FormControl();
  filteredClients: Observable<any[]>;
  selectedClient:Observable<any[]>;

  constructor(
    private eventService: EventService,
    private db: AngularFireDatabase,
    public dialogRef: MatDialogRef<DialogNewEvent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.members = db.list('members').snapshotChanges().map(arr => {
        return arr.map(snap => Object.assign(snap.payload.val(), { key: snap.key }) )
      })
      this.prestations = db.list('prestations').snapshotChanges().map(arr => {
        return arr.map(snap => Object.assign(snap.payload.val(), { key: snap.key }) )
      })
      this.clients = db.list('clientes').snapshotChanges().map(arr => {
        return arr.map(snap => Object.assign(snap.payload.val(), { key: snap.key }) )
      })
    }


  onNoClick(): void {
    this.dialogRef.close();
  }

  filterClients(val: string) {
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

  ngOnInit() {
    this.filteredClients = this.clientCtrl.valueChanges
      .startWith(null)
      .switchMap(client => {
        if(client) {
          if(client.insertdate) { 
            console.log('Goto Client Page'); 
            // var key = client.$key;
            this.selectedClient = client;
            // this.router.navigate(['/composer/'+key]);
            return this.clients;
          }
          else return this.filterClients(client)
        } else {
          // do something better here :P
          console.log('Do not get this case');
          return this.filterClients('something');
        }
      })    
  }


  saveEvent(data,client) {
    this.eventService.createEvent(data,client);
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
  paymentbutton:boolean = true;
  key: any;

  constructor(
    private eventService: EventService,
    private db: AngularFireDatabase,
    public dialogRef: MatDialogRef<DialogNewEvent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.key = data.key;
    this.meeting = this.eventService.getEventWithKey(this.key);

  }


  onNoClick(): void {
    this.dialogRef.close();
  }


  doingEvent(meeting,action) {
    this.eventService.doingEvent(meeting,action);
    this.dialogRef.close();
  }

  deleteEvent(event) {
    this.eventService.deleteEvent(event);
    this.dialogRef.close();
  }  

  ngOnInit() {
  }


}









