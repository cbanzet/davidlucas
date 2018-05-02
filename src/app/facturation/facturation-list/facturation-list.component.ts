import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import * as moment from 'moment'; // add this 1 of 4
import 'rxjs/add/operator/map';
import "rxjs/add/operator/switchMap";

import { AngularFireAction,AngularFireDatabase } from 'angularfire2/database';

import { FacturationService } from './../shared/facturation.service';
import { MemberService } from './../../members/shared/member.service';
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
    private billService: FacturationService
    ) 
   {
    this.date$ = new BehaviorSubject(null);
    this.bills$ = this.date$.switchMap(date => db.list('/bills', ref =>
        date ? ref.orderByChild('date').equalTo(date) : ref
      ).snapshotChanges().map(arr => {
          return arr.map(snap => Object
            .assign(
              snap.payload.val(),
              this.totalCart =  this.totalCart + snap.payload.val().totalTTC,
              this.total_CB = snap.payload.val().moyendepaiement == 'CB' ? this.total_CB + snap.payload.val().totalTTC : this.total_CB,
              this.total_CH = snap.payload.val().moyendepaiement == 'CH' ? this.total_CH + snap.payload.val().totalTTC : this.total_CH,
              this.total_ES = snap.payload.val().moyendepaiement == 'ES' ? this.total_ES + snap.payload.val().totalTTC : this.total_ES,
              this.total_CC = snap.payload.val().moyendepaiement == 'CC' ? this.total_CC + snap.payload.val().totalTTC : this.total_CC,
              this.total_VB = snap.payload.val().moyendepaiement == 'VB' ? this.total_VB + snap.payload.val().totalTTC : this.total_VB
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
        ),  
            this.totalCart = 0,this.total_CB=0, this.total_CH=0, this.total_ES=0, this.total_CC=0, this.total_VB=0
      )})
    );
  }

  ngOnInit() {
  	// this.factures = this.facturationService.getFacturesList(); 
    this.members      = this.memberService.getMembersNameList(); 
    this.bills        = this.billService.getBillsList();
    
    this.calendarDate = Date.now();      
    this.dateForQuery = this.eventService.getDate(this.calendarDate);
    this.date$.next(this.dateForQuery); 
  }

  addToTotal(key:string, price:number):void {
    if (this.check.indexOf(key) == -1) 
    {
      this.check = `${this.check} ${key}`;
      this.total += price;
      this.total = Math.round(this.total*100)/100;
    }
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

  updateDate(date) {
    // var dateString : string = date;
    // var tabs = dateString.split(' ');  
    // console.log(tabs[3]);
  }

  changeFactureStatut(facture) {
    // this.facturationService.changeFactureStatut(facture);  
  }

  deleteFacture(facture) {
    // this.facturationService.deleteFacture(facture);
  } 

}