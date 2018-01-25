import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { FirebaseApp } from 'angularfire2';
import { 	AngularFireDatabase, 
					AngularFireList, 
					AngularFireObject } from 'angularfire2/database';

import { Observable } from 'rxjs/Observable';
import { NgForm } from '@angular/forms';

import { Http,Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

import { EventService } from './../../events/shared/event.service';

@Injectable()
export class CartService {
  private cartPath = '/carts';
  cartsRef: AngularFireList<any>;

  constructor(
    private db: AngularFireDatabase, 
    private router: Router) {
    this.cartsRef = db.list('/carts', ref => ref.orderByChild('title'));
   }


//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////////////// C R E A T E
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


  createCart(client,date,data,totalHT,totalTAX,totalTTC)
  {
    var newCartData = {};
    var newData = [];
    if (data.length) {
    for(var i=0; i < data.length; i++) 
    {
      newData[i+1] = 
      {
          key:  data[i].key,
          title: data[i].title,
          time: data[i].time,
          price: data[i].price
      };
    }
    newCartData['timestamp'] = Date.now();
    newCartData['date'] = date;
    newCartData['source'] = client?'Calendar Module':'Cart Module';
    newCartData['totalHT'] = totalHT;
    newCartData['totalTAX'] = totalTAX;
    newCartData['totalTTC'] = totalTTC;
    newCartData['prestations'] = newData ;
    newCartData['clientkey'] = client?client.$key:null;
    newCartData['clientfullname'] = client?`${client.firstname} ${client.lastname}`:null;
    newCartData['clientphone'] = client?client.phone:null;
    newCartData['clientemail'] = client?client.email:null;

    var keyNewCard = this.cartsRef.push(newCartData).key;
    return keyNewCard;
  }
}





