import { Component, OnInit, Inject,  } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment'; // add this 1 of 4
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { AngularFireAction,AngularFireDatabase } from 'angularfire2/database';

import { FacturationService } from './../shared/facturation.service';
import { MemberService } from './../../members/shared/member.service';
import { Member } from './../../members/shared/member';
import { EventService } from './../../events/shared/event.service';

@Component({
  selector: 'app-facturation-list',
  templateUrl: './facturation-list.component.html',
  styleUrls: ['./facturation-list.component.css']
})
export class FacturationListComponent implements OnInit {

  bills         : Observable<any[]>;
  members       : Observable<any[]>;

  calendarDate  : any;
  dateForQuery  : any;

  bills$        : Observable<AngularFireAction<any>[]>;
  date$         : BehaviorSubject<string|null>;

  total         : number = 0;
  check         : string = "Check : ";
  checkdate     : string;

  totaux        : any;
  totalCart     : number = 0;
  total_CB      : number = 0;    
  total_CH      : number = 0;
  total_ES      : number = 0;    
  total_CC      : number = 0;    
  total_VB      : number = 0;    

  selectedName  : any;

  constructor(
		private router: Router,
    private location: Location,
    private memberService: MemberService,
    private eventService: EventService,
    private db: AngularFireDatabase,
    private billService: FacturationService,
    public dialog: MatDialog             
    ) 
  {
    this.getBills(db);
  }

  ngOnInit() {
    this.members      = this.memberService.getMembersNameList(); 
    this.bills        = this.billService.getBillsList();
    
    this.calendarDate = Date.now();      
    this.dateForQuery = this.eventService.getDate(this.calendarDate);
    this.date$.next(this.dateForQuery); 
  }


  getBills(db){
    this.date$ = new BehaviorSubject(null);
    this.bills$ = this.date$.switchMap(date => db.list('/bills', ref =>
        date ? ref.orderByChild('date').equalTo(date) : ref
      ).snapshotChanges().map(arr => {
          return arr.map(snap => Object.assign(
              snap.payload.val(),
              this.total_CB  = snap.payload.val().moyendepaiement == 'CB' ? 
                                 // round2nb(this.total_CB + snap.payload.val().totalTTC) : this.total_CB,
                                 Math.round((this.total_CB + snap.payload.val().totalTTC)*100)/100 : this.total_CB,
              this.total_CH  = snap.payload.val().moyendepaiement == 'CH' ?
                                 Math.round((this.total_CH + snap.payload.val().totalTTC)*100)/100 : this.total_CH,
              this.total_ES  = snap.payload.val().moyendepaiement == 'ES' ?
                                 Math.round((this.total_ES + snap.payload.val().totalTTC)*100)/100 : this.total_ES,
              this.total_CC  = snap.payload.val().moyendepaiement == 'CC' ?
                                 Math.round((this.total_CC + snap.payload.val().totalTTC)*100)/100 : this.total_CC,
              this.total_VB  = snap.payload.val().moyendepaiement == 'VB' ?
                                 Math.round((this.total_VB + snap.payload.val().totalTTC)*100)/100 : this.total_VB,
              this.totalCart = Math.round((this.totalCart + snap.payload.val().totalTTC)*100)/100,
              {
                $key: snap.key,
                date             : snap.payload.val().date,
                clientfullname   : snap.payload.val().clientfullname,
                statut           : snap.payload.val().statut,
                totalTTC         : snap.payload.val().totalTTC,
                moyendepaiment   : snap.payload.val().moyendepaiement,
              },
              {
                arrprestas: snap.payload.val().prestations?Object.values(snap.payload.val().prestations): 0
              },
              { arrproduits: snap.payload.val().products?Object.values(snap.payload.val().products):0},
        ), this.totalCart = 0,
            this.total_CB = 0, 
            this.total_CH = 0, 
            this.total_ES = 0, 
            this.total_CC = 0, 
            this.total_VB = 0,
      );
    })
   );
  }

  // round2nb(n) {
  //   var result = Math.round(n*100)/100;
  //   return result
  // }


  addToTotal(key:string, price:number):void {
    if (this.check.indexOf(key) == -1) 
    {
      this.check = `${this.check} ${key}`;
      this.total += price;
      this.total = Math.round(this.total*100)/100;
    }
  }

  resetTotaux() {
    this.totalCart = 0;
    this.total_CB = 0; 
    this.total_CH = 0; 
    this.total_ES = 0; 
    this.total_CC = 0; 
    this.total_VB = 0;    
  }

  reinitTotal(){
    this.check = "Check : ";
    this.total = 0;
  }
 
  filterCartsBy(date: string|null) {
    this.date$.next(date);
  }

  changeDay(date,nb) {
    this.reinitTotal();    
    this.calendarDate = moment(date).add(nb,'day');
    this.dateForQuery = this.eventService.getDate(this.calendarDate);
    this.filterCartsBy(this.dateForQuery);    
  }

  getToday() {
    var today = Date.now();
    this.calendarDate = moment(today);
    this.dateForQuery = this.eventService.getDate(this.calendarDate);
    this.filterCartsBy(this.dateForQuery);
  }


  changeFactureStatut(facture) {
    // this.facturationService.changeFactureStatut(facture);  
  }

  deleteFacture(facture) {
    // this.facturationService.deleteFacture(facture);
  } 

  openDialog(member,date): void {
    // console.log(member);    
    const dialogRef = this.dialog.open( FacturationListModaleComponent, 
    {
      width: '350px',
      height: '70px',
      data: { memberkey: member.$key, membername: member.name, date: date}
    });
      // dialogRef.afterClosed().subscribe(result => {
        // console.log('The dialog was closed');
      // });
  }
}












@Component({
  selector: 'app-facturation-list-modal',
  templateUrl: 'facturation-list-modal.html',
  styleUrls: ['./facturation-list.modal.css']    
})
export class FacturationListModaleComponent {

  dateForQuery     : any;
  calendarDate     : number;
  memberkey        : any;
  membername       : any;
  member           : Observable<any>;
  date$            : BehaviorSubject<string|null>;
  totalMemberCart  : any;
  basePath = '/members';

  constructor(
    public dialogRef: MatDialogRef<FacturationListModaleComponent>,
    private db: AngularFireDatabase,
    private memberService: MemberService,
    private eventService: EventService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.date$     = new BehaviorSubject(null);
      this.memberkey = data.memberkey;
      this.membername = data.membername;
      this.calendarDate = data.date;
      this.getMemberWithBillsKey(this.memberkey, this.db);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    // this.calendarDate = Date.now();      
    this.dateForQuery = this.eventService.getDate(this.calendarDate);
    this.date$.next(this.dateForQuery); 
  }

  getMemberWithBillsKey(key: string, db:any ): Observable<Member> {
    const memberPath = `${this.basePath}/${key}/billhistory`;
    this.member = this.date$.switchMap(date => db.list(memberPath, ref =>
    date ? ref.orderByChild('date').equalTo(date) : ref
       ).snapshotChanges().map(arr => {
        return arr.map(snap => Object
          .assign(
            snap.payload.val(),
            this.totalMemberCart =  Math.round((this.totalMemberCart + +snap.payload.val().price  )*100)/100,
           // console.log(this.totalMemberCart),
            {
              $key             : snap.key,
              date             : snap.payload.val().date,
              billkey          : snap.payload.val().billkey,
              price            : snap.payload.val().price,
            },
      ), this.totalMemberCart = 0
    );}));
   return this.member;
  }
}