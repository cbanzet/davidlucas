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

// import { FacturationService } from './../shared/facturation.service';
import { MemberService } from './../../members/shared/member.service';
import { CartService } from './../../cart/shared/cart.service';
import { EventService } from './../../events/shared/event.service';

@Component({
  selector: 'app-facturation-list',
  templateUrl: './facturation-list.component.html',
  styleUrls: ['./facturation-list.component.css']
})
export class FacturationListComponent implements OnInit {

  carts : Observable<any[]>;
  factures: Observable<any[]>;
  members : Observable<any[]>;

  calendarDate:any;
  dateForQuery:any;
  carts$: Observable<AngularFireAction<any>[]>;
  date$: BehaviorSubject<string|null>;

  total:number = 0;
  check: string = "Check : ";

  constructor(
		private router: Router,
    private location: Location,
    private memberService: MemberService,
    private cartService: CartService,
    private eventService: EventService,
    private db: AngularFireDatabase
    // private facturationService: FacturationService
    ) 
  { 
    this.date$ = new BehaviorSubject(null);
    this.carts$ = this.date$.switchMap(date => db.list('/carts', ref =>
        date ? ref.orderByChild('date').equalTo(date) : ref
      ).snapshotChanges().map(arr => {
          return arr.map(snap => Object
            .assign(
              // snap.payload.val(), 
            { 
              $key: snap.key,
              date             : snap.payload.val().date,              
              clientfullname   : snap.payload.val().clientfullname,
              statut           : snap.payload.val().statut,
              totalTTC         : snap.payload.val().totalTTC                        
            },
            { 
              prestas          : snap.payload.val().prestations?Object.values(snap.payload.val().prestations):0
            }        
        ))})
    );
  }

  ngOnInit() {
  	// this.factures = this.facturationService.getFacturesList(); 
    this.members  = this.memberService.getMembersNameList(); 
    // this.carts    = this.cartService.getCartListForReport();
    this.calendarDate = Date.now();      
    this.dateForQuery = this.eventService.getDate(this.calendarDate);
    this.date$.next(this.dateForQuery); 
  }

  addToTotal(key:string, price:number):void {
    if (this.check.indexOf(key) == -1) {
      this.check = `${this.check} ${key}`;
      console.log("key added");
      this.total += price;
      this.total = Math.round(this.total*100)/100;
    }
  }

 
  filterCartsBy(date: string|null) {
    this.date$.next(date);
  }

  changeDay(date,nb) {
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
    var dateString : string = date;
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