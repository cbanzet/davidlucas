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
      // this.cartsRef = db.list('/carts', ref => ref.orderByChild('title'));
      this.cartsRef = db.list('/carts');
   }


//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////
///////////////// G E T
//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


  getCartList() {
    return this.cartsRef.snapshotChanges().map(arr => {
      return arr.map(snap => Object.assign(
        snap.payload.val(), 
        // { musicians: snap.payload.val().artists?Object.values(snap.payload.val().artists):0},
        { $key: snap.key }) )
    })
  }




  getCartWithKey(key:string) {
    this.cart = this.db.object('carts/'+ key).snapshotChanges().map(action => {
      const $key = action.payload.key;
      const prestas = action.payload.val().prestations ? Object.values(action.payload.val().prestations) : null;
      const pdcts = action.payload.val().products ? Object.values(action.payload.val().products) : null;
      const data = 
      { 
        $key, 
        prestas,
        pdcts,
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
    newPrestaData['fromcalendar'] = dataPresta.fromcalendar;

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


 changeCoiffeurIncart(prestation, member, cart) {
    var cartkey = cart.$key;
    var prestakey = prestation.prestationkey? prestation.prestationkey:null;
    var memberkey = member.$key?member.$key:null;
    var memberFirstName = member.firstname?member.firstname:null;
    var eventkeys = prestation.events?Object.values(prestation.events):null;
    
    const cartMemberPath = `carts/${cartkey}/prestations/${prestakey}/membername`;
    const cartMemberKeyPath = `carts/${cartkey}/prestations/${prestakey}/memberkey`;
   
    var updateData = {};
    if (eventkeys) {
      for (let i = 0 ; i < eventkeys.length ; i++ ) {
        const eventPath =  `events/${eventkeys[i]}/memberfirstname`;        
        updateData[eventPath] = member.firstname;
      }
      updateData[cartMemberKeyPath] = memberkey;
      updateData[cartMemberPath] =  memberFirstName;

    }

    this.db.object("/").update(updateData).then(_=>
      console.log(updateData)
   );

  }


  addProductToCart(product,cart) {

    var cartkey = cart.$key;
    var productkey = product.$key;

    var cartNewPriceTTC = Math.round((parseFloat(cart.totalTTC)+parseFloat(product.px))*100)/100;
    var cartNewPriceHT = Math.round((cartNewPriceTTC/1.2)*100)/100;
    var cartNewTVA = Math.round((cartNewPriceTTC-cartNewPriceHT)*100)/100;

    var newPdct = {};
    newPdct['key'] =       productkey;
    newPdct['title'] =     product.title;
    newPdct['brand'] =     product.brand;
    newPdct['code'] =      product.codeEAN;
    newPdct['ref'] =       product.reference;
    newPdct['price'] =     product.px;

    var productInCartPath = `carts/${cartkey}/products/${productkey}`;
    var TTCCartPath       = `carts/${cartkey}/totalTTC/`;
    var HTCartPath        = `carts/${cartkey}/totalHT/`;
    var TVACartPath       = `carts/${cartkey}/totalTAX/`;

    var updateData = {};
    updateData[productInCartPath]= newPdct;
    updateData[TTCCartPath]= cartNewPriceTTC;
    updateData[HTCartPath]= cartNewPriceHT;
    updateData[TVACartPath]= cartNewTVA;

    console.log(updateData);

    this.db.object('/').update(updateData).then(_=>
      console.log(updateData)
    );

  }

  // Update Cart From Cart Module : Add Presta or Forfait
  updateInCart(cart,data,element) {
    var cartKey = cart.$key;
    var prestaKey = data.$key;
    var prestaTitle = data.title;
    var prestaPrice = data.priceDavid?data.priceDavid:data.priceDavid;
    var starttime = '';
    var timelength = data.time;
    var memberKey =cart.prestas[0].memberkey;
    var membername = cart.prestas[0].membername;

    var prestaInCartPath =  `carts/${cartKey}/prestations/${prestaKey}`;

    var totalHtInCart = cart.totalHT;
    var totalTaxInCart = cart.totalTAX;
    var totalTtcInCart = cart.totalTTC;

    var newTotalHT = Math.round((totalHtInCart+prestaPrice)*100)/100;
    var newTotalTax = Math.round((newTotalHT*0.2)*100)/100;
    var newTotalTtc =  newTotalTax + newTotalHT;

    const prestaPath = `carts/${cartKey}/prestations/${prestaKey}`;
    const totalHTPath = `carts/${cartKey}/totalHT`;
    const totalTAXPath = `carts/${cartKey}/totalTAX`;
    const totalTTCPath = `carts/${cartKey}/totalTTC`;
   
    var newPrestaData = {};
    var updateData = {};
    newPrestaData['prestationkey'] =  prestaKey;
    newPrestaData['prestationtitle'] = prestaTitle;
    newPrestaData['price'] = prestaPrice;
    newPrestaData['starttime'] = starttime;
    newPrestaData['timelength'] = timelength;
    newPrestaData['memberkey'] = memberKey;
    newPrestaData['membername'] = membername;
    newPrestaData['fromcalendar'] = false;

    updateData[prestaInCartPath]= newPrestaData;
    updateData[totalHTPath] = newTotalHT;
    updateData[totalTAXPath] = newTotalTax;
    updateData[totalTTCPath] = newTotalTtc;
    if(element === 'prestation') {
      this.db.object('/').update(updateData).then(_=>
        console.log(updateData)
     );
    } 
    else {
      // Intégration Forfait
      if(data.prestations.length){
        var total = 0;
        var updateDatas = {};
        for (let i = 0 ; i < data.prestations.length ; i++ ) {
          var dataPresta = {};
          var price = +data.prestations[i].priceDavid ? +data.prestations[i].priceDavid: +data.prestations[i].priceTeam;
          var prestationkey = data.prestations[i].key?data.prestations[i].key:null;
          dataPresta['prestationKey'] = prestationkey;
          dataPresta['prestationTitle'] = data.prestations[i].title?data.prestations[i].title:null;
          dataPresta['price'] =  price;
          dataPresta['starttime'] = starttime;
          dataPresta['timelength'] = data.prestations[i].time?data.prestations[i].time:null;
          dataPresta['memberkey'] = memberKey;
          dataPresta['membername'] = membername;
          dataPresta['fromcalendar'] = false;
          this.createPrestaInCart(cartKey,prestationkey,memberKey,membername,dataPresta);
          total = total + price;
        }
        var newTotalGroupHT =  Math.round((totalHtInCart+total)*100)/100;
        var newTotalTax = Math.round((newTotalGroupHT*0.2)*100)/100;
        var newTotalTtc =  newTotalTax + newTotalGroupHT;
        updateDatas[totalHTPath] = newTotalGroupHT;
        updateDatas[totalTAXPath] = newTotalTax;
        updateDatas[totalTTCPath] = newTotalTtc;
        this.db.object('/').update(updateDatas).then(_=>
          console.log(updateDatas)
        );
      }
    }
  }






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

  deleteCart(cart,prestas) {

    var cartkey    = cart.$key;
    var clientkey  = cart.clientkey;

    const cartPath       = `carts/${cartkey}`;
    const cartlookupPath = `lookUpCartPrestations/${cartkey}`;

    var deleteData = {};
    deleteData[cartPath] = null;
    deleteData[cartlookupPath] = null;

    if(prestas) 
    {
      for (var i = 0; i < prestas.length; i++) 
      {
        var prestakey = prestas[i].prestationkey;
        var memberkey = prestas[i].memberkey;
        var eventkeys  = prestas[i].events?Object.values(prestas[i].events):null;
        for (var j = 0; j < eventkeys.length; j++) 
        {

          var eventkey = eventkeys[j];
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

    // console.log(deleteData);
    this.db.object("/").update(deleteData).then(_=>
       console.log(deleteData)
    );
  }



 removePrestaFromCart(presta,cart) {

    var deleteData = {};

    var cartkey = cart.$key?cart.$key:null;
    var eventkeys = presta.events?Object.values(presta.events):null;
    var prestakey = presta.prestationkey? presta.prestationkey:null;
    var clientkey = cart.clientkey?cart.clientkey:null;
    var memberkey = presta.memberkey?presta.memberkey:null;
    var prestaPrice = presta.price;
    var totalHtInCart = cart.totalHT;
    var totalTaxInCart = cart.totalTAX;
    var totalTtcInCart = cart.totalTTC;

    var newTotalHT = Math.round((totalHtInCart-prestaPrice)*100)/100;
    var newTotalTax = Math.round((newTotalHT*0.2)*100)/100;
    var newTotalTtc =  newTotalTax + newTotalHT;

    const prestaPath = `carts/${cartkey}/prestations/${prestakey}`;
    const totalHTPath = `carts/${cartkey}/totalHT`;
    const totalTAXPath = `carts/${cartkey}/totalTAX`;
    const totalTTCPath = `carts/${cartkey}/totalTTC`;
    
    if(presta.fromcalendar) {
      for ( let i = 0; i < eventkeys.length ; i++) {
        var eventkey = eventkeys[i] ;
        const eventPath = `events/${eventkey}`;
        const clientPath = `clientes/${clientkey}/events/${eventkey}`;
        const membersPath = `members/${memberkey}/events/${eventkey}`;
        const memberRole = `members/3/events/${eventkey}`;
        const lookUpClientEvents = `lookUpClientEvents/${clientkey}/${eventkey}/`;
        const lookUpMemberEvents = `lookUpMemberEvents/${memberkey}/${eventkey}/`;

        deleteData[eventPath] = null;
        deleteData[clientPath] = null;
        deleteData[membersPath] = null;
        deleteData[lookUpClientEvents] = null;
        deleteData[lookUpMemberEvents] = null;
        deleteData[memberRole] = null;
      }
    }
    
    deleteData[prestaPath] = null;
    if(cart.prestas.length !== 1) {
      deleteData[totalHTPath] = newTotalHT;
      deleteData[totalTAXPath] = newTotalTax;
      deleteData[totalTTCPath] = newTotalTtc;
    }
   
    console.log(deleteData);
    this.db.object("/").update(deleteData).then(_=>
       console.log(deleteData)
    );

  }

  removeProductFromCart(product, cart) {

    var cartkey              = cart.$key?cart.$key:null;
    var productkey           = product.key?product.key:null;
    var productPrice         = product.price;
    var totalHtInCart        = cart.totalHT;
    var totalTaxInCart       = cart.totalTAX;
    var totalTtcInCart       = cart.totalTTC;

    var newTotalTTC          =  Math.round((totalTtcInCart-productPrice)*100)/100;
    var newTotalHT           = Math.round((newTotalTTC/1.2)*100)/100;
    var newTotalTax          = Math.round((newTotalTTC-newTotalHT)*100)/100;

    const pdtCartPath        = `carts/${cartkey}/products/${productkey}`;
    const totalHTPath        = `carts/${cartkey}/totalHT`;
    const totalTAXPath       = `carts/${cartkey}/totalTAX`;
    const totalTTCPath       = `carts/${cartkey}/totalTTC`;

    var deleteData           = {};
    deleteData[pdtCartPath]  = null;
    deleteData[totalHTPath]  = newTotalHT;
    deleteData[totalTAXPath] = newTotalTax;
    deleteData[totalTTCPath] = newTotalTTC;

    this.db.object("/").update(deleteData).then(_=>
       console.log(deleteData)
    );

  }




}