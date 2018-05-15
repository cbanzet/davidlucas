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
import { MemberService } from './../../members/shared/member.service';
import { ClientService } from './../../clients/shared/client.service';
import { ForfaitService } from './../../forfaits/shared/forfait.service';
import { CartService } from './../../cart/shared/cart.service';
import { Cart } from './../shared/cart';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './../../ui/angularmaterial.module';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { PrestationService } from './../../prestations/shared/prestation.service';
import { Type } from './../../prestations/shared/type';
import { Prestation} from './../../prestations/shared/prestation';

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
    "19:00",
    "19:15",
    "19:30",
    "19:45",
    "20:00",            
  ] 

  constructor(
    private eventService: EventService,
    public dialog: MatDialog,
    private router: Router,    
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
              clientfullname: snap.payload.val().clientfullname,
              statut: snap.payload.val().statut,
              memberfirstname: snap.payload.val().memberfirstname,
              tempsdepause: snap.payload.val().prestationkey=='-L88anNPIm-AOG3-Vqx9' ? '1':'0',
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
      // console.log('The dialog was closed');
    });
  }  

  openDialogSeeEvent(event, data): void {
    var statut = data.statut;
    var cartkey = data.cartkey;

    if(statut=='filled') {
      this.router.navigate(['/cart/'+cartkey]);
    }

    else {
      event.stopPropagation();
      let dialogSeeEventRef = this.dialog.open(DialogSeeEvent, {
        width: '600px',
        data: { 
          key: data.key,
          event: data,
          cartkey: data.cartkey
        }
      });
      dialogSeeEventRef.afterClosed().subscribe(result => {
        // console.log('The event dialog was closed');
      });
    }
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
  types: Observable<any[]>;  
  prestations: Observable<any[]>;
  forfaits: Observable<any[]>;
  clients: Observable<any[]>;
  clientCtrl: FormControl = new FormControl();
  filteredClients: Observable<any[]>;
  selectedClient:Observable<any[]>;
  newClientSelected: Observable<any[]>;
  
  saveMeetingWithNewClient:boolean=false;

  selectPrestaOrForfait:boolean=true;
  showPrestaSelect:boolean=false;
  showForfaitsSelect:boolean=false;
  showTypeSelect:boolean = false;
  showPrestaTypeList:boolean = true;
  composeCart:boolean=false;

  // composeCart:boolean=false;
  cartData: Array<any> = [];
  cartFull:boolean=false;

  totalHT:number=0;
  totalTAX:number=0;
  totalTTC:number=0;

  typeselected: string ;
  filtre: Object;

  forfaitTypes: Observable<any[]>;
  typeselectedforfait: string;
  showTypeSelectForfait: boolean;
  filtreForfait: object;

  formAddClient:boolean=false;
  searchClientForm: boolean=true;
  commandemodal:boolean=false;
  showCartContent:boolean=false;

  dropClientOnlyOnce:boolean=false;
  getNewClientPhone:any;
  getNewClientEmail:any;     
  getNewClientFirstname:any; 
  getNewClientLastname:any;  
  getNewClientKey:any;       

  constructor(
    private clientService: ClientService,
    private eventService: EventService,
    private prestationService: PrestationService,
    private forfaitService: ForfaitService,    
    private db: AngularFireDatabase,
    public dialogRef: MatDialogRef<DialogNewEvent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.forfaits = this.forfaitService.getForfaitsList();
      this.members = this.eventService.getMembersListForDayViewCalendar();
      this.clients = this.eventService.getFormatClientsList();
     // this.prestations = this.eventService.getTitlePrestationsList();
      this.prestations = this.prestationService.getPrestationsList();
      this.types = this.prestationService.getPrestaTypeList();
      this.forfaitTypes = this.forfaitService.getForfaitTypeList();
    }


  onNoClick(): void {
    this.dialogRef.close();
  }

  filterClients(val: string) {
    // console.log(val);
    return this.clients
    .map(response => response.filter(client => { 
      if(Number.isInteger(+val)) 
      {
        return client.phone.toLowerCase().indexOf(val.toLowerCase()) === 0;
      } 
      else
      {      
        return (client.firstname.toLowerCase().indexOf(val.toLowerCase()) === 0)
        || (client.lastname.toLowerCase().indexOf(val.toLowerCase()) === 0);
      }   
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
    this.typeselected = '';
  	this.cartData["totalHT"]=0;

    this.filteredClients = this.clientCtrl.valueChanges
      .startWith(null)
      .switchMap(client => {
        if(client) {
          if(client.lastname) { 
            console.log(client)
            // this.selectedClientFromSearchForm = true;
            this.selectedClient = client;
            return this.clients;
          }
          else return this.filterClients(client)
        } else {
          return this.filterClients('something');
        }
      })    
  }

  typeSelected(type: Type) {
    this.typeselected = type.title;
    this.showTypeSelect = true;
    this.filtre = {
      types: [[ '' , this.typeselected ]]
    };
    console.log( this.typeselected);
  }

  typeSelectedForfait(type: Type) {
    this.typeselectedforfait = type.title;
    this.showTypeSelectForfait = true;
    this.showTypeSelect = false;
    this.filtreForfait = {
        type: this.typeselectedforfait
    };
    console.log( this.typeselectedforfait);
  }

  /////////////////////////////////////////////////////////////////
  // NEW CLIENT 
  onSubmit(newClientForm: NgForm) {
    var clientkey = this.clientService.createClientFromNewEventModal(newClientForm);
    this.formAddClient = false;
    this.saveMeetingWithNewClient = true;
    this.newClientSelected = this.clientService.getClientWithKeyOnce(clientkey);
  }   

  saveNewClientInfoInCtrl(client):void {
    if(this.dropClientOnlyOnce==false) {     
     this.getNewClientPhone     = client.phone;
     this.getNewClientEmail     = client.email;
     this.getNewClientFirstname = client.firstname;
     this.getNewClientLastname  = client.lastname;
     this.getNewClientKey       = client.$key;                    

     this.dropClientOnlyOnce    = true;
    }
  }


	/////////////////////////////////////////////////////////////////
  // CART 
  insertItemInCart(data) {

    this.showCartContent=true;
    this.commandemodal=true;

    var isInCart:Boolean;
    var id:number;
    var newPrice:number;
    length = this.cartData.length;
    if(length)
    {
      for(var i = 0 ; i < length ;  i++) {
        if(data.$key === this.cartData[i].$key  ) {
          isInCart = true;
          id = i;
        }
      }
    }
    if(!isInCart) 
    {
      this.cartData.push(data);
      this.sumTablePrice('add', +data.price);
    } 
    else 
    {
      const oldPrice =  data.price;
      this.cartData[id].quantity =  this.cartData[id].quantity + 1 ;
      this.cartData[id].price =   oldPrice * this.cartData[id].quantity ;
      newPrice = this.cartData[id].price?this.cartData[id].price:oldPrice;
        // console.log(newPrice);
      if(this.cartData[id].quantity > 2) 
      {
           this.sumTablePrice('add', +newPrice );
           this.sumTablePrice('remove', +oldPrice * (this.cartData[id].quantity - 1 )  );
            console.log( oldPrice * ( this.cartData[id].quantity - 1 ) );
      } 
      else 
      {
          this.sumTablePrice('add', +newPrice );
          this.sumTablePrice('remove', oldPrice);
      }
    }
  }

  formatPrestaBeforeInsert(isDavid,data) {
    var key = data.$key?data.$key:0;
    var title = data.title?data.title:0;
    var time = data.time?data.time:0;
    var price = isDavid=="David" ? data.priceDavid:data.priceTeam;
    var salonkey = data.salonkey?data.salonkey:0;
    var quantity = 1;
    const prestation = {
      $key: key,
      title:title,
      time:time,
      price:price,
      quantity: quantity
    };
    if(key&&title&&time&&price) {
      this.insertItemInCart( prestation);
     console.log(this.cartData);
    }
    else {console.log("Entrée incomplËte")}
  }

  formatForfaitBeforeInsert(isDavid,data) {
    var dataPresta:Prestation;
    var nbprestas = data.prestations.length;
    var key =[];
    var price =[];
    var title =[];
    var time = [];
    var quantity = [];
     var isInCart = [];
     var tab = [];
     var k = 0;
     length = this.cartData.length;
     if(nbprestas) {
       for( var i = 0 ; i < nbprestas ; i++) {
         key[i] = data.prestations[i].key ? data.prestations[i].key:0;
         title[i] = data.prestations[i].title ? data.prestations[i].title:0;
         time[i] = data.prestations[i].time ? data.prestations[i].time:0;
         quantity[i] = 1;
         price[i] = isDavid=="David" ? data.prestations[i].priceDavid:data.prestations[i].priceTeam;
        const prestation = {
             $key: key[i],
             title: title[i],
             time: time[i],
             price: price[i],
             quantity: quantity[i]
           };
          this.insertItemInCart(prestation);
       }
     }
  }


  removeElement(index: number,px: number) {
    this.sumTablePrice('remove',px);
    this.cartData.splice(index, 1);
    // console.log(index,element);
  }



  // CALCUL PX TTC FIRST 
  getTotalTTC(addOrRemove,px) {
    if(addOrRemove=='add'){
      this.totalTTC = Math.round((px+this.totalTTC)*100)/100;
    }
    else if(addOrRemove=='remove') {
      this.totalTTC = Math.round((this.totalTTC-px)*100)/100;
    }
  }
  getTotalHT() {
    this.totalHT = Math.round((this.totalTTC/1.2)*100)/100;
  }
  getTotalTAX() {
    this.totalTAX = Math.round((this.totalTTC - this.totalHT)*100)/100;
  }  
  sumTablePrice(addOrRemove,px) {
    this.getTotalTTC(addOrRemove,px);
    this.getTotalHT();
    this.getTotalTAX();
  }


	/////////////////////////////////////////////////////////////////


  getNewClientBeforeSavingEvent(data) {

    const client = {};
    client['$key'] = this.getNewClientKey;
    client['email'] = this.getNewClientEmail;
    client['phone'] = this.getNewClientPhone;
    client['firstname'] = this.getNewClientFirstname;
    client['lastname'] = this.getNewClientLastname;

    this.saveEvent(data,client);
  }


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
  cart:Observable<any[]>;
  suitemeeting: any;
  members: Observable<any[]>;
  paymentbutton:boolean=true;
  key: any; cartkey:any;
  showDatePicker:boolean=false;
  showSavedDate:boolean=true;
  justClicked: boolean= true;

  constructor(
    private cartService: CartService,
    private eventService: EventService,
    private memberService: MemberService,
    private router: Router,    
    private db: AngularFireDatabase,
    public dialogRef: MatDialogRef<DialogNewEvent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.key = data.event.$key;
    this.cartkey = data.event.cartkey;
    this.meeting = this.eventService.getEventWithKey(this.key);
    this.cart = this.cartService.getCartWithKey(this.cartkey);
    this.members = this.memberService.getMembersList();
    // this.suitemeeting = this.eventService.getEventsSerie(this.key,data.date,data.time);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  doingCart(cart,action) {
    if(action=='done') { 
      this.cartService.doCart(cart,'filled');
      this.router.navigate(['/cart/'+cart.$key]);
    }
    else if(action=='ongoing') {
      this.cartService.doCart(cart,'ongoing');
    }
    this.dialogRef.close();
  }

  deleteCart(cart,prestas) {
    this.cartService.deleteCart(cart,prestas);
    this.dialogRef.close();    
  }  

  removePrestaFromCart(presta,cart) {
    if(cart.prestas.length === 1) {
      this.deleteCart(cart,presta);
    }
    this.cartService.removePrestaFromCart(presta,cart);
  }

  changeCoiffeur(element,member,cart,type) {
    this.cartService.changeCoiffeurIncart(element,member,cart,type);
  }

  changePrestaTime(time, cart, presta) {
    this.cartService.changeTimeIncart(time, cart, presta);
  }

  ngOnInit() {
  	// console.log(this.cartkey);
    // console.log(this.data.event);
  }

}