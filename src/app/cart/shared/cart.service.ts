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
  cart:  Observable<any>;


  constructor(
    private db: AngularFireDatabase, 
    private router: Router) {
    this.cartsRef = db.list('/carts', ref => ref.orderByChild('title'));
   }


//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////////////// G E T
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


  getCartWithKey(key:string) {
    this.cart = this.db.object('carts/'+ key).snapshotChanges().map(action => {
      const $key = action.payload.key;
      const prestas = action.payload.val() ? Object.values(action.payload.val().prestations) : null;
      // const alleventslinked = action.payload.val().alleventslinked ? Object.values(action.payload.val().alleventslinked) : null;
      const data = 
      { 
        $key, 
        prestas,
        ...action.payload.val() 
      };
      return data;
    });
  return this.cart
  }



//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////////////// C R E A T E
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

  createCartFromCalendar(client,starttime,date,totalHT,totalTAX,totalTTC)
  {
    var newCartData = {};
    newCartData['timestamp'] = Date.now();
    newCartData['date'] = date;
    newCartData['source'] = client?'Calendar Module':'Cart Module';
    newCartData['statut'] = 'waiting';
    newCartData['totalHT'] = totalHT;
    newCartData['totalTAX'] = totalTAX;
    newCartData['totalTTC'] = totalTTC;
    newCartData['clientkey'] = client?client.$key:null;
    newCartData['clientfullname'] = client?`${client.firstname} ${client.lastname}`:null;
    newCartData['clientphone'] = client?client.phone:null;
    newCartData['clientemail'] = client?client.email:null;
    newCartData['cartstarttime'] = starttime?starttime:null;
    newCartData['clientfirstname'] = client?client.firstname:null;
    newCartData['clientlastname'] = client?client.lastname:null;
    newCartData['clientphone'] = client?client.phone:null;
    newCartData['clientemail'] = client?client.email:null;

    // dataNewEvent['rolekey'] = data.selectedCoiffeur?data.selectedCoiffeur.rolekey:null; 

    // console.log(newCartData);

    var keyNewCard = this.cartsRef.push(newCartData).key;
    return keyNewCard;
  }


  createCartFromCartForm(date,data,totalHT,totalTAX,totalTTC)
  {
    // var coiffeurkey = coiffeur?coiffeur.$key:0;
    // var coiffeurname = coiffeur.firstname?coiffeur.firstname:0;

    // var newCartData = {};
    // var newData = [];
    // if (data.length) 
    // {
    //   for(var i=1; i <= data.length; i++) 
    //   {
    //     newData[i] = 
    //     {
    //       key:  data[i].key,
    //       title: data[i].title,
    //       time: data[i].time,
    //       price: data[i].price,
    //       member: coiffeur?coiffeur:null,
    //       memberkey: memberkey?memberkey:null
    //     };
    //      // console.log(newData);
    //   }
    //   newCartData['timestamp'] = Date.now();
    //   newCartData['date'] = date;
    //   newCartData['source'] = client?'Calendar Module':'Cart Module';
    //   newCartData['statut'] = 'waiting';
    //   newCartData['totalHT'] = totalHT;
    //   newCartData['totalTAX'] = totalTAX;
    //   newCartData['totalTTC'] = totalTTC;
    //   newCartData['prestations'] = newData ;
    //   newCartData['clientkey'] = client?client.$key:null;
    //   newCartData['clientfullname'] = client?`${client.firstname} ${client.lastname}`:null;
    //   newCartData['clientphone'] = client?client.phone:null;
    //   newCartData['clientemail'] = client?client.email:null;

    //   // console.log(newCartData);

    //   var keyNewCard = this.cartsRef.push(newCartData).key;
    //   return keyNewCard;
    // }
  }

  

  createPrestaInCart(cartkey,prestationkey,memberkey,membername,dataPresta) {
    var newPrestaData = {};
    newPrestaData['prestationkey'] = dataPresta.prestationKey;
    newPrestaData['prestationtitle'] = dataPresta.prestationTitle;
    newPrestaData['price'] = dataPresta.price;
    newPrestaData['starttime'] = dataPresta.starttime;
    newPrestaData['timelength'] = dataPresta.timelength;
    newPrestaData['timelength'] = dataPresta.timelength;
    newPrestaData['memberkey'] = memberkey;
    newPrestaData['membername'] = membername;

    const cartPath = `carts/${cartkey}/prestations/${prestationkey}/`;

    var updateData = {};
    updateData[cartPath]= newPrestaData;
    updateData['/lookUpCartPrestations/'+cartkey+'/'+prestationkey]= true;

    this.db.object("/").update(updateData).then(_=> 
      console.log(updateData)
    );    
  }



//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////////////// U P D A T E ////////////////////////////
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


  doCart(cart,newstatut) {
    var cartkey = cart.$key;
    var clientkey = cart.clientkey;

    const cartPath = `carts/${cartkey}/statut`;
    var prestations = cart.prestations?Object.values(cart.prestations):null;

    var updateData = {};
    updateData[cartPath] = newstatut;

    if(prestations) {
      var nbOfPrestas = prestations.length;
      for (var i = 0; i < nbOfPrestas; i++) {
        var prestameta = prestations[i];
        var presta = Object.entries(prestameta); 
        var events = Object.values(presta[0][1]);
        var nbOfEvents = events.length;
        for (var j = 0; j < nbOfEvents; j++) 
        {
          var eventkey = events[j];
          var eventPath = `events/${eventkey}/statut/`;
          updateData[eventPath] = newstatut;
        }
      }
    }

    // console.log(updateData);
    this.db.object("/").update(updateData).then(_=>
       console.log(updateData)
    );
  }






//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////////////// D E L E T E
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

  deleteCart(cart) {
    // console.log(cart);
    var cartkey = cart.$key;
    var clientkey = cart.clientkey;

    var prestations = cart.prestations?Object.values(cart.prestations):null;

    const cartPath = `carts/${cartkey}`;
    const cartlookupPath = `lookUpCartPrestations/${cartkey}`;

    var deleteData = {};
    deleteData[cartPath] = null;
    deleteData[cartlookupPath] = null;

    if(prestations) {
      var nbOfPrestas = prestations.length;
      for (var i = 0; i < nbOfPrestas; i++) {
        var prestameta = prestations[i];
        var presta = Object.entries(prestameta); 
        
        var memberkey = presta[1][1];
        var prestakey = presta[3][1];
        
        var events = Object.values(presta[0][1]);
        var nbOfEvents = events.length;
        for (var j = 0; j < nbOfEvents; j++) 
        {
          var eventkey = events[j];

          var eventPath = `events/${eventkey}`;
          var eventInClientPath = `clientes/${clientkey}/events/${eventkey}/`;
          var eventInMemberPath = `members/${memberkey}/events/${eventkey}/`;
          var lookUpClientEvents = `lookUpClientEvents/${clientkey}/${eventkey}/`;
          var lookUpMemberEvents = `lookUpMemberEvents/${memberkey}/${eventkey}/`;

          deleteData[eventPath] = null;
          deleteData[eventInClientPath] = null;
          deleteData[eventInMemberPath] = null;
          deleteData[lookUpClientEvents] = null;
          deleteData[lookUpMemberEvents] = null;
        }
      }
    }

    console.log(deleteData);
    this.db.object("/").update(deleteData).then(_=>
       console.log(deleteData)
    );
  }



  removePrestaFromCart(presta,cart) {
    console.log(presta);
    console.log(cart);
  }







}